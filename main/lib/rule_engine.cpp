
#include "rule_engine.h"
#include "../plugins/c004_timers.h";
#include <map>

#define byte uint8_t
#define TAG_RE "RuleEngine"

byte *rule_list[20]; //every trigger has its entry
byte *event_list[20];
byte old_values[256]; // reserve 128 bytes for storing old values
byte old_values_free_ptr = 0; // points to the place in array which is free
std::map<uint16_t, void*> rule_data_ptrs;
//byte event_triggers[8]; // 256 possible events (custom)
uint16_t timers[16];
byte timer_triggers[2];
byte *rule_engine_hwtimers[4] = {};
byte *rule_engine_hwinterrupts[16] = {};
byte *rule_engine_alexa_triggers[10] = {};

extern Plugin *active_plugins[10];
extern TimersPlugin *timers_plugin;

ESP_EVENT_DEFINE_BASE(RULE_EVENTS)
esp_event_loop_handle_t rule_event_loop;

static void user_event_handler(void* handler_args, esp_event_base_t base, int32_t id, void* event_data)
{
    // Two types of data can be passed in to the event handler: the handler specific data and the event-specific data.
    //
    // The handler specific data (handler_args) is a pointer to the original data, therefore, the user should ensure that
    // the memory location it points to is still valid when the handler executes.
    //
    // The event-specific data (event_data) is a pointer to a deep copy of the original data, and is managed automatically.
    uint32_t event_id = ((uint32_t) event_data);
    ESP_LOGI(TAG_RE, "user event triggered: %p : %i [%p]", event_data, event_id, event_list[event_id]);
    run_rule(event_list[event_id], nullptr, 0, 255);
}

void init() {
    esp_event_loop_args_t rule_event_loop_args = {
        .queue_size = 50,
        .task_name = "rule_loop_task", // task will be created
        .task_priority = uxTaskPriorityGet(NULL),
        .task_stack_size = 2048,
        .task_core_id = tskNO_AFFINITY
    };

    ESP_ERROR_CHECK(esp_event_loop_create(&rule_event_loop_args, &rule_event_loop));

    ESP_ERROR_CHECK(esp_event_handler_register_with(rule_event_loop, RULE_EVENTS, RULE_USER_EVENT, user_event_handler, rule_event_loop));
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
                ESP_LOGI(TAG_RE, "compare val(%p):%d old(%p):%d", val, val[i], old, old[i]);
                if (val[i] == old[i]) match = false;
                break;
            case 1: // equals
                ESP_LOGI(TAG_RE, "compare val(%p):%d to :%d", val, val[i], cmd[i + 2]);
                if (cmd[i + 2] != val[i]) match = false;
                break;
            case 2: // <
            case 3: // >
            case 4: // <=
            case 5: // >=
            case 6: // <>
                break;
        }
        old[i] = 1; // todo: val[i];
    }
    *ptr+= cmd[1] + 2;
    return match;
}

// comparison: [len][[dev][var][type][len]]
bool multi_compare(byte **ptr) {
    byte *cmd = *ptr;
    ESP_LOGI(TAG_RE, "multi compare [%x %x %x %x %x]", cmd[0], cmd[1], cmd[2], cmd[3], cmd[4]);
    bool match = true;
    byte len = cmd[0];
    cmd++;
    byte *old;
    for (byte i = 0; i < len; i++) {

        Plugin *p = active_plugins[cmd[0]];
        if (p == nullptr) return false;
        byte *var = (byte*)p->getStatePtr(cmd[1]);
        ESP_LOGI(TAG_RE, "reading plugin %d (%p) variable %d (%p)", cmd[0], p, cmd[1], var);

        uint16_t oldId = *cmd;
        if (!rule_data_ptrs[oldId]) {
            rule_data_ptrs[oldId] = old_values + old_values_free_ptr;
            old_values_free_ptr += cmd[4];
        }
        old = (byte*)rule_data_ptrs[oldId];
        ESP_LOGI(TAG_RE, "getting ptr to old data (%p)", old);
        cmd+=2;
        ESP_LOGI(TAG_RE, "comparing");
        if (!compare(&cmd, var, old)) match = false;

    }
    *ptr = cmd;
    return match;
}

int parse_rules(byte *rules, long len) {
    init();
    int rules_found = 0;
    int events_found = 0;
    for (byte i = 0; i < len; i++) {
        if (rules[i] == 0xff && rules[i+1] == 0xfe && rules[i+2] == 0x00 && rules[i+3] == 0xff) {
            switch (rules[i+4]) {
                case TRIG_EVENT:
                    ESP_LOGI(TAG_RE, "found an event on address: %p", (void*)(rules + i + 4 + 2));
                    event_list[events_found++] = rules + i + 6;
                    break;
                case TRIG_VAR:
                    ESP_LOGI(TAG_RE, "found a trigger on address: %p", (void*)(rules + i + 5));
                    rule_list[rules_found++] = rules + i + 5;
                    break;
                case TRIG_TIMER:
                    ESP_LOGI(TAG_RE, "found a timer trigger %d, on address: %p", rules[i+5], (void*)(rules + i + 6));
                    rule_list[rules_found++] = rules + i + 6;
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
            }
        }
    }
    return rules_found;
}

int averagerun = 1000;
int lastrun = 0;
uint8_t run_rule(byte* start, byte* start_val, uint8_t start_val_length, uint8_t len = 255) {
    byte* cmd = start;
    byte* state_val = start_val;
    uint8_t state_val_length = start_val_length;

    Plugin *p;
    byte *var;
    while(cmd[0] != CMD_ENDON && ((cmd - start) < len)) {
        switch(cmd[0]) {
            case CMD_GPIO:
                ESP_LOGI(TAG_RE, "cmd GPIO %d = %d", cmd[1], cmd[2]);
                gpio_set_direction((gpio_num_t)cmd[1], GPIO_MODE_INPUT_OUTPUT);
                gpio_set_level((gpio_num_t)cmd[1], cmd[2]);
                cmd += 3;
                break;
            case CMD_DELAY:
                // todo: add pointer to here to the timers ?
                ESP_LOGI(TAG_RE, "cmd delay %d", cmd[1]);
                cmd += 2;
                break;
            case CMD_EVENT:
                ESP_LOGI(TAG_RE, "cmd triggering event %d", cmd[1]);
                TRIGGER_EVENT(cmd[1]);
                cmd += 2;
                break;
            case CMD_TIMER:
                ESP_LOGI(TAG_RE, "cmd triggering timer %d time: %d", cmd[1], cmd[2]*100);
                TRIGGER_TIMER(cmd[1], cmd[2]*100);
                cmd += 3;
                break;
            case CMD_GET:
                // CMD_GET DEVICE_ID VAR_ID LENGTH
                ESP_LOGI(TAG_RE, "cmd get p:%d v:%d l:%d", cmd[1], cmd[2], cmd[3]);
                p = active_plugins[cmd[1]];
                if (p != nullptr) {
                    state_val = (uint8_t*)p->getStatePtr(cmd[2]);
                    state_val_length = cmd[3];
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
                        ESP_LOGI(TAG_RE, "cmd set %d:%d to %d", cmd[1], cmd[2], *state_val);
                        p->setStatePtr(cmd[2], state_val);
                    } else {
                        p->setStatePtr(cmd[2], cmd+4);
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
                while(cmd[0] != CMD_ENDIF) cmd++;
                break;
            // endif commands, does nothing, just marker for if/else
            case CMD_ENDIF:
                ESP_LOGI(TAG_RE, "cmd endif");
                cmd++;
                break;
            case CMD_HW_TIMER_EN:

                break;
            case CMD_HW_INTERRUPT_EN:
                break;
           
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
        ESP_LOGD(TAG_RE, "checking rule type:[%i] on address: %i [%x %x %x %x]", rule[0], (unsigned)(rule), rule[0], rule[1], rule[2], rule[3]);
        byte *cmd = rule;
        byte *old;
        uint16_t oldId;
        Plugin *p;
        byte *var;
        bool match = false;

        switch (cmd[0]) { // trigger type (0: var, 1: event, 2: timer, 3: system
            // device variable
            case 0:
                p = active_plugins[cmd[1]];
                var = (byte*)p->getStatePtr(cmd[2]);

                oldId = *cmd;
                if (!rule_data_ptrs[oldId]) {
                    rule_data_ptrs[oldId] = old_values + old_values_free_ptr;
                    old_values_free_ptr += cmd[5];
                }
                old = (byte*)rule_data_ptrs[oldId];
                cmd += 3;
                match = compare(&cmd, var, old);
                break;
            // event
            // case 1:
            //     match = IS_EVENT_TRIGGERED(cmd[1]);
            //     if (match) CLEAR_EVENT(cmd[1]);
            //     cmd += 2;
            //     break;
            // timer
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
            cmd += run_rule(cmd, nullptr, 0);
        }
    }


    lastrun = xTaskGetTickCount() * portTICK_PERIOD_MS;
    averagerun = (9* averagerun + (lastrun - startrun))/10;

    ESP_LOGD(TAG_RE, "updated last run to %d", lastrun);
}