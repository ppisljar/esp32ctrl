
#include "rule_engine.h"
#include "../plugins/c004_timers.h"
#include "../plugins/c007_logging.h"
#include "../plugins/c008_cron.h"
#include "../plugins/utils.h"
#include "spiffs.h"
#include <map>

#define byte uint8_t
#define TAG_RE "RuleEngine"

byte *rule_list[20]; //every trigger has its entry
byte *alert_list[20]; //every trigger has its entry
byte *event_list[20];
byte old_values[256]; // reserve 128 bytes for storing old values
byte old_values_free_ptr = 0; // points to the place in array which is free
std::map<uint16_t, void*> rule_data_ptrs;
std::map<uint16_t, unsigned char*> system_events;
//byte event_triggers[8]; // 256 possible events (custom)
uint16_t timers[16];
byte timer_triggers[2];
byte *rule_engine_hwtimers[4] = {};
byte *rule_engine_hwinterrupts[16] = {};
byte *rule_engine_alexa_triggers[10] = {};
byte *rule_engine_touch_triggers[10] = {};
byte *rule_engine_bluetooth_triggers[10] = {};

extern Plugin *active_plugins[50];
extern TimersPlugin *timers_plugin;
extern CronPlugin *cron_plugin;

ESP_EVENT_DEFINE_BASE(RULE_EVENTS);
esp_event_loop_handle_t rule_event_loop;
esp_event_loop_handle_t system_event_loop;

static void user_event_handler(void* handler_args, esp_event_base_t base, int32_t id, void* event_data)
{
    // Two types of data can be passed in to the event handler: the handler specific data and the event-specific data.
    //
    // The handler specific data (handler_args) is a pointer to the original data, therefore, the user should ensure that
    // the memory location it points to is still valid when the handler executes.
    //
    // The event-specific data (event_data) is a pointer to a deep copy of the original data, and is managed automatically.
    uint8_t *data =  (uint8_t*)event_data;
    uint16_t event_id = *((uint16_t*)data);
    uint8_t data_len = data[2];
    ESP_LOGD(TAG_RE, "user event triggered: %p : %d with %d bytes of data", data, event_id, data_len);
    if (event_id < 1024) {
        auto event = event_list[event_id];
        if (event != nullptr) {
            ESP_LOGD(TAG_RE, "running rule %p", event_list[event_id]);
            run_rule(event_list[event_id], nullptr, 0, 255);
        } else {
            ESP_LOGW(TAG_RE, "invalid event");
        }
    } else {
        ESP_LOGD(TAG_RE, "sytem event");
        if (system_events[event_id] != nullptr) {
            run_rule(system_events[event_id], data + 3, data_len, 255);
        }
    }

}

void fire_system_event(uint16_t evt_id, uint8_t evt_data_len, uint8_t *evt_data) {
    uint8_t *data = (uint8_t*)malloc(evt_data_len + 3);
    ((uint16_t*)data)[0] = evt_id;
    data[2] = evt_data_len;
    memcpy(data+3, evt_data, evt_data_len);
    TRIGGER_EVENT(data);
}



void load_rules() {
    long rule_length;
    uint8_t* rules = (uint8_t*)read_file("/spiffs/rules.dat", &rule_length);
    if (rules != NULL && rule_length > 0) {
        ESP_LOGI(TAG_RE, "parsing rule file of size: %ld", rule_length);
        parse_rules(rules, rule_length);
    }
}

void init_rules() {
    load_rules();

    esp_event_loop_args_t rule_event_loop_args = {
        .queue_size = 50,
        .task_name = "rule_loop_task", // task will be created
        .task_priority = uxTaskPriorityGet(NULL),
        .task_stack_size = 4048,
        .task_core_id = tskNO_AFFINITY
    };

    ESP_ERROR_CHECK(esp_event_loop_create(&rule_event_loop_args, &rule_event_loop));

    ESP_ERROR_CHECK(esp_event_handler_register_with(rule_event_loop, RULE_EVENTS, RULE_USER_EVENT, user_event_handler, rule_event_loop));
}

void reload_rules() {
    for (int i = 0; i < 20; i++) {
        rule_list[i] = nullptr;
        alert_list[i] = nullptr;
        event_list[i] = nullptr;
        if (i < 16) {
            rule_engine_hwinterrupts[i] = nullptr;
            timers[i] = 0;
        }
        if (i < 10) {
            rule_engine_alexa_triggers[i] = nullptr;
            rule_engine_touch_triggers[i] = nullptr;
            rule_engine_bluetooth_triggers[i] = nullptr;
        }
        if (i < 4) {
            rule_engine_hwtimers[i] = nullptr;
        }
    }
    load_rules();
}


static std::map<uint8_t, std::function<uint8_t(uint8_t*)>> custom_commands;
void register_command(uint8_t cmd_id, std::function<uint8_t(uint8_t*)> handler) {
    custom_commands.emplace(cmd_id, handler);
}

uint8_t find_command(uint8_t cmd_id, uint8_t *start) {
    auto cmd = custom_commands.find(cmd_id);
    if (cmd != custom_commands.end()) {
        ESP_LOGI(TAG_RE, "found custom command %i at %p", cmd_id, cmd->second);
        return cmd->second(start);
    }
    return 0;
}

// comparison: [type][len][value] : x>5
bool compare(byte** ptr, byte *val, byte *old) {
    byte *cmd = *ptr;
    
    bool match = true;
    for (byte i = 0; i < cmd[1]; i++) {
        switch (cmd[0]) {
            case 0: // every change
                ESP_LOGD(TAG_RE, "compare val(%p):%d old(%p):%d", val, val[i], old, old[i]);
                if (val[i] == old[i]) match = false;
                break;
            case 1: // equals
                ESP_LOGD(TAG_RE, "compare val(%p):%d == :%d", val, val[i], cmd[i + 2]);
                if (cmd[i + 2] != val[i]) match = false;
                break;
            case 2: // <
                ESP_LOGD(TAG_RE, "compare val(%p):%d < :%d", val, val[i], cmd[i + 2]);
                if (val[i] >= cmd[i + 2]) match = false;
                break;
            case 3: // >
                ESP_LOGD(TAG_RE, "compare val(%p):%d > :%d", val, val[i], cmd[i + 2]);
                if (val[i] <= cmd[i + 2]) match = false;
                break;
            case 4: // <=
                ESP_LOGD(TAG_RE, "compare val(%p):%d <= :%d", val, val[i], cmd[i + 2]);
                if (val[i] > cmd[i + 2]) match = false;
                break;
            case 5: // >=
                ESP_LOGD(TAG_RE, "compare val(%p):%d >= :%d", val, val[i], cmd[i + 2]);
                if (val[i] < cmd[i + 2]) match = false;
                break;
            case 6: // <>
                ESP_LOGD(TAG_RE, "compare val(%p):%d <> :%d", val, val[i], cmd[i + 2]);
                if (cmd[i + 2] == val[i]) match = false;
                break;
        }
        //ESP_LOGI(TAG_RE, "updating old %d to new %d", old[i], val[i]);
        old[i] = val[i]; // todo: val[i];
    }
    *ptr+= cmd[1] + 2;
    return match;
}

// comparison: [len][[dev][var][type][len]]
bool multi_compare(byte **ptr) {
    byte *cmd = *ptr;
    ESP_LOGD(TAG_RE, "multi compare [%x %x %x %x %x]", cmd[0], cmd[1], cmd[2], cmd[3], cmd[4]);
    bool match = true;
    byte len = cmd[0];
    cmd++;
    byte *old;
    for (byte i = 0; i < len; i++) {

        Plugin *p = active_plugins[cmd[0]];
        if (p == nullptr) return false;
        void *var = p->getStateVarPtr(cmd[1], nullptr);
        ESP_LOGD(TAG_RE, "reading plugin %d (%p) variable %d (%p)", cmd[0], p, cmd[1], var);

        uint16_t oldId = *cmd;
        if (!rule_data_ptrs[oldId]) {
            rule_data_ptrs[oldId] = old_values + old_values_free_ptr;
            old_values_free_ptr += cmd[3];
        }
        old = (byte*)rule_data_ptrs[oldId];
        ESP_LOGD(TAG_RE, "getting ptr to old data (%p)", old);
        cmd+=2;
        ESP_LOGD(TAG_RE, "comparing");
        if (!compare(&cmd, (uint8_t*)var, old)) match = false;

    }
    *ptr = cmd;
    return match;
}

int parse_rules(byte *rules, long len) {
    
    int rules_found = 0;
    int events_found = 0;
    for (byte i = 0; i < len; i++) {
        if (rules[i] == 0xff && rules[i+1] == 0xfe && rules[i+2] == 0x00 && rules[i+3] == 0xff) {
            switch (rules[i+4]) {
                case TRIG_EVENT:
                    // 2 byte eventid
                    ESP_LOGI(TAG_RE, "found an event on address: %p", (void*)(rules + i + 6));
                    event_list[1 + events_found++] = rules + i + 6; // ??type needs to be included
                    break;
                case TRIG_VAR:
                    ESP_LOGI(TAG_RE, "found a trigger on address: %p", (void*)(rules + i + 4));
                    rule_list[rules_found++] = rules + i + 4; // type needs to be included
                    break;
                case TRIG_TIMER:
                    ESP_LOGI(TAG_RE, "found a timer trigger %d, on address: %p", rules[i+5], (void*)(rules + i + 6));
                    rule_list[rules_found++] = rules + i + 4; // type needs to be included
                    break;
                case TRIG_HWTIMER:
                    ESP_LOGI(TAG_RE, "found hw timer %d on address: %p", rules[i+5], (void*)(rules + i + 6));
                    rule_engine_hwtimers[rules[i + 5]] = rules + i + 6;
                    break;
                case TRIG_HWINTER:
                    ESP_LOGI(TAG_RE, "found hw trigger %d on address: %p", rules[i+5], (void*)(rules + i + 6));
                    rule_engine_hwinterrupts[rules[i + 5]] = rules + i + 6;
                    // todo: enable interrupt on selected pin
                    timers_plugin->enableHwInterrupt(rules[i + 5]);
                    break;
                case TRIG_ALEXA:
                    ESP_LOGI(TAG_RE, "found alexa %d on address: %p", rules[i + 5], (void*)(rules + i + 6));
                    rule_engine_alexa_triggers[rules[i + 5]] = rules + i + 6;
                    break;
                case TRIG_TOUCH:
                    ESP_LOGI(TAG_RE, "found touch %d on address: %p", rules[i + 5], (void*)(rules + i + 6));
                    rule_engine_touch_triggers[rules[i + 5]] = rules + i + 6;
                    break;
                case TRIG_CRON:
                    ESP_LOGI(TAG_RE, "found cron %s on address: %p", rules + i + 5, (void*)(rules + i + 6 + strlen((char*)rules + i + 5)));
                    cron_plugin->addCron(rules + i + 5, (void*)(rules + i + 6 + strlen((char*)rules + i + 5)));
                    break;   
                case TRIG_BLUETOOTH:
                    ESP_LOGI(TAG_RE, "found bletooth %s on address: %p", rules + i + 5, (void*)(rules + i + 6));
                    rule_engine_bluetooth_triggers[rules[i + 5]] = rules + i + 6;
                    break;     
            }
        }
    }
    return rules_found;
}

int parse_alerts(byte *alerts, long len) {
    int alerts_found = 0;

    for (byte i = 0; i < len; i++) {
        if (alerts[i] == 0xff && alerts[i+1] == 0xfe && alerts[i+2] == 0x00 && alerts[i+3] == 0xff) {
            switch (alerts[i+4]) {
                case TRIG_VAR:
                    alert_list[alerts_found++] = alerts + i + 4;
                    break;
            }
        }
    }
    return alerts_found;
}

void check_alerts() {
    for (auto alert : alert_list) {
        if (alert == NULL) break;
        uint8_t alert_id = *alert;
        alert++;
        if (multi_compare(&alert)) {
            // fire alert
        }
    }
}

int averagerun = 1000;
int lastrun = 0;
uint8_t run_rule(byte* start, void* start_val, uint8_t start_val_length, uint8_t len = 255) {
    ESP_LOGI(TAG_RE, "run_rule %p %d", start, start[0]);
    byte* cmd = start;
    void* state_val = start_val;
    Type state_type = (Type)start_val_length;
    float x = 0;
    float y = 0;
    double state_val_value = 0;
    uint8_t state_val_length = start_val_length;
    bool exit = false;

    Plugin *p;
    byte *var;
    while(cmd[0] != CMD_ENDON && ((cmd - start) < len) && !exit) {
        switch(cmd[0]) {
            case CMD_GPIO:
                ESP_LOGI(TAG_RE, "cmd GPIO %d = %d", cmd[1], cmd[2]);
                gpio_set_direction((gpio_num_t)cmd[1], GPIO_MODE_INPUT_OUTPUT);
                gpio_set_level((gpio_num_t)cmd[1], cmd[2]);
                cmd += 3;
                break;
            case CMD_DELAY: {
                uint32_t ppp = (uint32_t)(cmd + 2);
                uint32_t x = ppp;
                // todo: add pointer to here to the timers ?
                ESP_LOGI(TAG_RE, "cmd delay %d at %p, %p, %i", cmd[1], (void*)ppp, state_val, state_val_length);
                soft_timer([=](){
                    ESP_LOGI(TAG_RE, "continuing at %p, %p, %i, %p", (void*)ppp, state_val, state_val_length, (void*)x);
                    run_rule((uint8_t*)x, state_val, state_val_length, 255);
                }, cmd[1] * 1000, false);
                exit = true;
                // vTaskDelay( cmd[1] * 1000 / portTICK_PERIOD_MS);
                // cmd += 2;
                break;
            } case CMD_EVENT:
                // CMD_EVENT EVENT_ID (2 bytes) DATA_LEN DATA
                cmd++;
                ESP_LOGI(TAG_RE, "cmd triggering event %d %p with %d bytes of data", *((uint16_t*)cmd), cmd, cmd[2]);
                TRIGGER_EVENT(cmd);
                cmd += 3 + cmd[2];
                break;
            case CMD_TIMER: {
                // CMD_TIMER TIMER_ID TIME TIME
                int16_t timetowait = (cmd[3] << 8) + cmd[2];
                ESP_LOGI(TAG_RE, "cmd triggering timer %d time: %ds", cmd[1], timetowait);
                TRIGGER_TIMER(cmd[1], timetowait*100);
                cmd += 4;
                break;
            } case CMD_GET:
                // CMD_GET DEVICE_ID VAR_ID LENGTH
                ESP_LOGI(TAG_RE, "cmd get p:%d v:%d l:%d", cmd[1], cmd[2], cmd[3]);
                p = active_plugins[cmd[1]];
                if (p != nullptr) {
                    void* temp_v;
                    Type temp_t;
                    switch(cmd[2]) {
                        case 0:
                            state_val = p->getStateVarPtr(cmd[3], &state_type);                            break;
                        case 1:
                            CONVERT_STATE(x, Type::decimal, p, cmd[3]);
                            break;
                        case 2:
                            CONVERT_STATE(y, Type::decimal, p, cmd[3]);
                            break;
                    }
                }
                cmd += 3;
                break;
            // sets state on device
            case CMD_SET:
                // CMD_SET DEVICE_ID VAR_ID LENGTH VALUE
                ESP_LOGI(TAG_RE, "cmd set %d:%d to %d %d", cmd[1], cmd[2], cmd[3], cmd[4]);
                p = active_plugins[cmd[1]];
                ESP_LOGD(TAG_RE, "cmd set %p %p", p, cmd+4);
                // TODO: check if plugin exists ..
                // fuckup: disabling a plugin will require to recompile all rules

                // we need to know variable name ...
                // 1. it can be in the rules, will make it slower
                // 2. we can allow setting variable name by index
                if (p != nullptr) {
                    if (cmd[4] == 255) {
                        ESP_LOGI(TAG_RE, "cmd set %d:%d to %d", cmd[1], cmd[2], *(int*)state_val); // TODO: state_var ptr
                        p->setStateVarPtr(cmd[2], state_val, state_type);
                    } else {
                        p->setStateVarPtr(cmd[2], cmd+4, (Type)cmd[3]);
                    }
                }

                // we need to get value
                // 1. this depends on the type of variable: byte, 2 bytes, 4 bytes, string
                cmd += cmd[3] + 4; // increase by the amount of bytes this command took
                break;
            // if statement
            case CMD_IF:
                ESP_LOGI(TAG_RE, "cmd IF");
                cmd++;
                if (multi_compare(&cmd)) {
                    ESP_LOGI(TAG_RE, "IF/IF");
                    //cmd++;
                } else {
                    ESP_LOGI(TAG_RE, "IF/ELSE");
                    while(cmd[0] != CMD_ELSE) cmd++;
                    cmd++;
                }
                break;
            // else statement, if we are here it means if was executed and we need to skip code
            // until we find endif command
            case CMD_ELSE:
                ESP_LOGI(TAG_RE, "cmd else");
                while(cmd[0] != CMD_ENDIF) {
                    cmd++;
                    ESP_LOGI(TAG_RE, "++");
                }
                break;
            // endif commands, does nothing, just marker for if/else
            case CMD_ENDIF:
                ESP_LOGI(TAG_RE, "cmd endif");
                cmd++;
                break;
                // hw_timer timer_idx timer_value
            case CMD_HW_TIMER_EN:
                cmd++;
                ESP_LOGI(TAG_RE, "starting hw timer %d %llu", cmd[0], *(uint64_t*)(cmd+1));
                if (*(uint64_t*)(cmd+1) == 0) {
                    timer_pause(cmd[0] > 1 ? TIMER_GROUP_1 : TIMER_GROUP_0, (timer_idx_t)(cmd[0]%2));
                } else if (*(uint64_t*)(cmd+1) == 43243423) {
                    if (state_type == Type::integer) {
                        uint64_t ti = (*(int*)state_val) * 1000;
                        timer_set_counter_value(cmd[0] > 1 ? TIMER_GROUP_1 : TIMER_GROUP_0, (timer_idx_t)(cmd[0]%2), 0);
                        timer_set_alarm_value(cmd[0] > 1 ? TIMER_GROUP_1 : TIMER_GROUP_0, (timer_idx_t)(cmd[0]%2), ti);
                        timer_start(cmd[0] > 1 ? TIMER_GROUP_1 : TIMER_GROUP_0, (timer_idx_t)(cmd[0]%2));
                    }
                } else {
                    timer_set_counter_value(cmd[0] > 1 ? TIMER_GROUP_1 : TIMER_GROUP_0, (timer_idx_t)(cmd[0]%2), 0);
                    timer_set_alarm_value(cmd[0] > 1 ? TIMER_GROUP_1 : TIMER_GROUP_0, (timer_idx_t)(cmd[0]%2), *(uint64_t*)(cmd+1));
                    timer_start(cmd[0] > 1 ? TIMER_GROUP_1 : TIMER_GROUP_0, (timer_idx_t)(cmd[0]%2));
                }
                
                cmd += 9;
                break;
            case CMD_HTTP: {
                cmd++;
                std::string url((const char*)cmd);
                cmd += url.length() + 1;
                if (state_val != nullptr) {
                    replace_string_in_place(url, "%state%", std::to_string(*(int*)state_val));  // todo state_val ptr
                }
                ESP_LOGI(TAG_RE, "cmd http req to %s", url.c_str());
                makeHttpRequest((char*)url.c_str());
                break;
            }
            case CMD_MATH: {
                cmd++;
                std::string expr_str((const char*)cmd);
                cmd += expr_str.length() + 1;
                te_variable vars_temp[] = {{"state", state_val}, {"x", &x}, {"y", &y}};
                te_expr *expr = te_compile(expr_str.c_str(), vars_temp, 1, 0);
                state_val_value = te_eval(expr);
                state_val = (uint8_t*)&state_val_value;
                state_val_length = 4;
                break;
            }
            case CMD_LOGGING_START: {
                cmd++;
                logging_plugin->start();
                break;
            }

            case CMD_LOGGING_STOP: {
                logging_plugin->stop();
                cmd++;
                break;
            }
            
            // plugin provided commands
            default:
                ESP_LOGI(TAG_RE, "cmd: %i", cmd[0]);
                cmd += find_command(cmd[0], cmd+1);
                cmd++;
                break;
        }
    }
    return (uint8_t)(cmd-start);
}

void run_rules() {
    int startrun = (xTaskGetTickCount() * portTICK_PERIOD_MS);
    uint16_t diff = ((xTaskGetTickCount() * portTICK_PERIOD_MS) - lastrun) / 10; // todo: needs to check for overflow
    ESP_LOGD(TAG_RE, "diff since last run: %d (%li)", diff, (long)((xTaskGetTickCount() * portTICK_PERIOD_MS) - lastrun));
    for (byte ti = 0; ti < 16; ti++) {
        ESP_LOGD(TAG_RE, "checking timer %d time: %d", ti, timers[ti]);
        if (timers[ti] > 0) timers[ti] = timers[ti] > diff ? timers[ti] - diff : 0;
    }

    for (auto rule : rule_list) {
        if (rule == NULL) continue;
        //ESP_LOGI(TAG_RE, "checking rule type:[%i] on address: %i [%x %x %x %x]", rule[0], (unsigned)(rule), rule[0], rule[1], rule[2], rule[3]);
        byte *cmd = rule;
        byte *old;
        uint16_t oldId;
        Plugin *p;
        byte *var;
        bool match = false;
        unsigned char *start_val = nullptr;
        uint8_t start_val_len = 0;

        switch (cmd[0]) { // trigger type (0: var, 1: event, 2: timer, 3: system
            // device variable
            case 0:
                //ESP_LOGI(TAG_RE, "checking variable %d:%d", cmd[1],cmd[2]);
                p = active_plugins[cmd[1]];
                if (p == nullptr) continue;
                var = (uint8_t*)p->getStateVarPtr((int)cmd[2], nullptr);

                oldId = cmd[1] * 10 + cmd[2]; // id is id * 10 + varid
                //ESP_LOGI(TAG_RE, "checking for old id %i", oldId);
                if (!rule_data_ptrs[oldId]) {
                    //ESP_LOGI(TAG_RE, "old id not found, creating");
                    rule_data_ptrs[oldId] = old_values + old_values_free_ptr;
                    old_values_free_ptr += cmd[4];
                }
                
                old = (byte*)rule_data_ptrs[oldId];
                cmd += 3;
                //ESP_LOGI(TAG_RE, "oldid: %d, old: %p, old[0]: %d", oldId, old, old[0]);
                match = compare(&cmd, var, old);
                if (match) {
                    start_val = var;
                    start_val_len = 1;
                    cmd--;
                }
                break;
            case 2:
                ESP_LOGD(TAG_RE, "checking timer %d time: %d", cmd[1], timers[cmd[1]]);
                match = IS_TIMER_TRIGGERED(cmd[1]);
                if (match) {
                    ESP_LOGD(TAG_RE, "timer %d triggered, clearing", cmd[1]);
                    CLEAR_TIMER(cmd[1]);
                }
                cmd += 2;
                break;
        }
        if (match) {
            ESP_LOGI(TAG_RE, "match! executing rule [%x %x %x %x]", cmd[0], cmd[1], cmd[2], cmd[3]);
            // for each command
            cmd += run_rule(cmd, start_val, (Type)start_val_len);
        }
    }


    lastrun = xTaskGetTickCount() * portTICK_PERIOD_MS;
    averagerun = (9* averagerun + (lastrun - startrun))/10;

    ESP_LOGD(TAG_RE, "updated last run to %d", lastrun);
}