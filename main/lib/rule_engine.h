#ifndef ESP_LIB_RULE_ENGINE_H
#define ESP_LIB_RULE_ENGINE_H

#include "../plugins/plugin.h"
#include "esp_event.h"
#include "esp_event_loop.h"
#include "esp_timer.h"
#include "esp_event_base.h"

int parse_rules(unsigned char *rules, long len);
uint8_t run_rule(unsigned char* start, uint8_t len);
void run_rules();

ESP_EVENT_DECLARE_BASE(RULE_EVENTS)
enum {
    RULE_USER_EVENT
};

typedef uint8_t(*rule_command_handler_t)(uint8_t *start); 

#ifndef rule_event_loop
extern esp_event_loop_handle_t rule_event_loop;
#endif

// #define TRIGGER_EVENT(x) event_triggers[x/8] |= 1 << (x%8)
// #define CLEAR_EVENT(x) event_triggers[x/8] &= ~(1 << (x%8))
// #define IS_EVENT_TRIGGERED(x) (event_triggers[x/8] >> (x%8) & 1) > 0
#define TRIGGER_EVENT(x) ESP_ERROR_CHECK(esp_event_post_to(rule_event_loop, RULE_EVENTS, RULE_USER_EVENT, (void*)x, 1, portMAX_DELAY));

#define TRIGGER_TIMER(x, time) timers[x] = time; timer_triggers[x/8] |= 1 << (x%8)
#define CLEAR_TIMER(x) timers[x] = 0; timer_triggers[x/8] &= ~(1 << (x%8))
#define IS_TIMER_TRIGGERED(x) timers[x] == 0 && ((timer_triggers[x/8] >> (x%8)) & 1) > 0

#define CMD_HW_INTERRUPT_EN     0xe0
#define CMD_HW_INTERRUPT_DIS    0xe1
#define CMD_HW_TIMER_EN         0xe2
#define CMD_HW_TIMER_DIS        0xe3

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
#define CMD_BITBANG 0xfb
#define CMD_IF      0xfc
#define CMD_ELSE    0xfd
#define CMD_ENDIF   0xfe
#define CMD_ENDON   0xff

#endif