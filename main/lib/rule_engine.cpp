
#include "rule_engine.h"
#include "../plugins/plugin.h"

#define byte uint8_t
#define TAG_RE "RuleEngine"

byte *rule_list[20]; //every trigger has its entry
byte old_values[256]; // reserve 128 bytes for storing old values
byte old_values_free_ptr = 0; // points to the place in array which is free
std::map<uint16_t, void*> rule_data_ptrs;
byte event_triggers[8]; // 256 possible events (custom)
uint16_t timers[16];
byte timer_triggers[2];

extern Plugin *active_plugins[10];

// comparison: [type][len][value] : x>5
bool compare(byte** ptr, byte *val, byte *old) {
    byte *cmd = *ptr;
    ESP_LOGI(TAG_RE, "compare val(%p) old(%p) [%x %x %x]", val, old, cmd[0], cmd[1], cmd[2]);
    bool match = true;
    for (byte i = 0; i < cmd[1]; i++) {
        switch (cmd[0]) {
            case 0: // every change
                if (cmd[i + 2] != old[i]) match = false;
                break;
            case 1: // equals
                if (cmd[i + 2] != val[i]) match = false;
                break;
            case 2: // <
            case 3: // >
            case 4: // <=
            case 5: // >=
            case 6: // <>
                break;
        }
        old[i] = 1; //val[i];
    }
    *ptr+= cmd[1];
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
    int rules_found = 0;
    for (byte i = 0; i < len; i++) {
        if (rules[i] == 0xff && rules[i+1] == 0xfe && rules[i+2] == 0x00 && rules[i+3] == 0xff) {
            ESP_LOGI(TAG_RE, "found a trigger on address: %p", (void*)(rules + i + 4));
            rule_list[rules_found++] = rules + i + 4;
        }
    }
    return rules_found;
}

int lastrun = 0;
void run_rules() {
    uint16_t diff = ((xTaskGetTickCount() * portTICK_PERIOD_MS) - lastrun) / 10; // todo: needs to check for overflow
    ESP_LOGD(TAG_RE, "diff since last run: %d (%li)", diff, (long)((xTaskGetTickCount() * portTICK_PERIOD_MS) - lastrun));
    for (byte ti = 0; ti < 16; ti++) {
        ESP_LOGD(TAG_RE, "checking timer %d time: %d", ti, timers[ti]);
        if (timers[ti] > 0) timers[ti] = timers[ti] > diff ? timers[ti] - diff : 0;
    }

    for (auto rule : rule_list) {
        if (rule == NULL) continue;
        ESP_LOGI(TAG_RE, "checking rule type:[%i] on address: %i [%x %x %x %x]", rule[0], (unsigned)(rule), rule[0], rule[1], rule[2], rule[3]);
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
            case 1:
                match = IS_EVENT_TRIGGERED(cmd[1]);
                if (match) CLEAR_EVENT(cmd[1]);
                cmd += 2;
                break;
            // timer
            case 2:
                ESP_LOGI(TAG_RE, "checking timer %d time: %d", cmd[1], timers[cmd[1]]);
                match = IS_TIMER_TRIGGERED(cmd[1]);
                if (match) {
                    ESP_LOGI(TAG_RE, "timer %d triggered, clearing", cmd[1]);
                    CLEAR_TIMER(cmd[1]);
                }
                cmd += 2;
                break;
        }
        if (match) {
            ESP_LOGI(TAG_RE, "match! executing rule [%x %x %x %x]", cmd[0], cmd[1], cmd[2], cmd[3]);
            // for each command
            while(cmd[0] != CMD_ENDON) {
                switch(cmd[0]) {
                    case CMD_GPIO:
                        ESP_LOGI(TAG_RE, "cmd GPIO %d", cmd[1]);
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
                    // sets state on device
                    case CMD_SET:
                        ESP_LOGI(TAG_RE, "cmd set %d", cmd[1]);
                        p = active_plugins[cmd[1]];
                        // we need to know variable name ...
                        // 1. it can be in the rules, will make it slower
                        // 2. we can allow setting variable name by index
                        p->setStatePtr(cmd[2], cmd+4);

                        // we need to get value
                        // 1. this depends on the type of variable: byte, 2 bytes, 4 bytes, string
                        cmd += cmd[3]; // increase by the amount of bytes this command took
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
                    // plugin provided commands
                    default:
                        ESP_LOGI(TAG_RE, "cmd: %i", cmd[0]);
                        cmd++;
                        break;
                }
            }
        }
    }


    lastrun = xTaskGetTickCount() * portTICK_PERIOD_MS;
    ESP_LOGD(TAG_RE, "updated last run to %d", lastrun);
}