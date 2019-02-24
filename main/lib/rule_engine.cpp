
#include "rule_engine.h"
#include "../plugins/plugin.h"

#define byte uint8_t

byte *rule_list[20]; //every trigger has its entry
byte old_values[256]; // reserve 128 bytes for storing old values
byte old_values_free_ptr = 0; // points to the place in array which is free
std::map<uint16_t, void*> rule_data_ptrs;

#define CMD_SET     0xf0
#define CMD_SET_CFG 0xf1
#define CMD_EVENT   0xf2
#define CMD_TIMER   0xf3
#define CMD_X       0xf4
#define CMD_X2      0xf5
#define CMD_X3      0xf6
#define CMD_X4      0xf7
#define CMD_X5      0xf8
#define CMD_X6      0xf9
#define CMD_X7      0xfa
#define CMD_X8      0xfb
#define CMD_IF      0xfc
#define CMD_ELSE    0xfd
#define CMD_ENDIF   0xfe
#define CMD_ENDON   0xff

extern Plugin *active_plugins[10];

// comparison: [type][len][value] : x>5
bool compare(byte** ptr, byte *val, byte *old) {
    byte *cmd = *ptr;
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
        old[i] = val[i];
    }
    *ptr+= cmd[1];
    return match;
}

// comparison: [len][[var][comparison]]
bool multi_compare(byte **ptr) {
    bool match = true;
    byte len = (*ptr++)[0];
    byte *cmd = *ptr;
    byte *old;
    for (byte i = 0; i < len; i++) {
        Plugin *p = active_plugins[cmd[0]];
        byte *var = (byte*)p->getStatePtr(cmd[1]);
        uint16_t oldId = *cmd;
        if (!rule_data_ptrs[oldId]) {
            rule_data_ptrs[oldId] = old_values + old_values_free_ptr;
            old_values_free_ptr += cmd[4];
        }
        old = (byte*)rule_data_ptrs[oldId];
        cmd+=2;
        if (!compare(&cmd, var, old)) match = false;
    }
    return match;
}

int parse_rules(byte *rules, long len) {
    int rules_found = 0;
    for (byte i = 0; i < len; i++) {
        if (rules[i] == 0xff && rules[i+1] == 0xfe && rules[i+2] == 0x00 && rules[i+3] == 0xff) {
            rule_list[rules_found++] = rules + 4;
        }
    }
    return rules_found;
}

void run_rules() {
    for (auto rule : rule_list) {
        byte *cmd = rule;
        byte *old;
        // check if rule is triggered
        // 1. we should probably not be checking just active_plugins but have some specials like `system`, `timer`, `event`
        Plugin *p = active_plugins[cmd[0]];
        // 2. we need a way to access variable
        // 3. we need a way to compare variables independent of type
        byte *var = (byte*)p->getStatePtr(cmd[1]);

        uint16_t oldId = *cmd;
        if (!rule_data_ptrs[oldId]) {
            rule_data_ptrs[oldId] = old_values + old_values_free_ptr;
            old_values_free_ptr += cmd[4];
        }
        old = (byte*)rule_data_ptrs[oldId];
        cmd += 2;
        // this way will be hard to do < and >
        if (compare(&cmd, var, old)) {

            // for each command
            while(cmd[0] != CMD_ENDON) {
                switch(cmd[0]) {
                    // sets state on device
                    case CMD_SET:
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
                        if (multi_compare(&cmd)) {
                            //cmd++;
                        } else {
                            while(cmd[0] != CMD_ELSE) cmd++;
                            cmd++;
                        }
                        break;
                    // else statement, if we are here it means if was executed and we need to skip code
                    // until we find endif command
                    case CMD_ELSE:
                        while(cmd[0] != CMD_ENDIF) cmd++;
                        break;
                    // endif commands, does nothing, just marker for if/else
                    case CMD_ENDIF:
                        cmd++;
                        break;
                    // plugin provided commands
                    default:
                        break;
                }
            }
        }
    }
}