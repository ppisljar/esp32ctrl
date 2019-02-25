#ifndef ESP_LIB_RULE_ENGINE_H
#define ESP_LIB_RULE_ENGINE_H

int parse_rules(unsigned char *rules, long len);
void run_rules();

#define TRIGGER_EVENT(x) event_triggers[x/8] |= 1 << (x%8)
#define CLEAR_EVENT(x) event_triggers[x/8] &= ~(1 << (x%8))
#define IS_EVENT_TRIGGERED(x) (event_triggers[x/8] >> (x%8) & 1) > 0

#define TRIGGER_TIMER(x, time) timers[x] = time; timer_triggers[x/8] |= 1 << (x%8)
#define CLEAR_TIMER(x) timers[x] = 0; timer_triggers[x/8] &= ~(1 << (x%8))
#define IS_TIMER_TRIGGERED(x) timers[x] == 0 && ((timer_triggers[x/8] >> (x%8)) & 1) > 0

#define CMD_SET     0xf0
#define CMD_SET_CFG 0xf1
#define CMD_EVENT   0xf2
#define CMD_TIMER   0xf3
#define CMD_DELAY   0xf4
#define CMD_RESET   0xf5
#define CMD_GPIO    0xf6
#define CMD_GET     0xf7
#define CMD_GET_CFG 0xf8
#define CMD_VAR     0xf9
#define CMD_SEND    0xfa
#define CMD_X8      0xfb
#define CMD_IF      0xfc
#define CMD_ELSE    0xfd
#define CMD_ENDIF   0xfe
#define CMD_ENDON   0xff

#endif