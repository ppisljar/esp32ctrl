#ifndef ESP_LIB_RULE_ENGINE_H
#define ESP_LIB_RULE_ENGINE_H

#include "esp_event.h"
#include "esp_event_loop.h"
#include "esp_timer.h"
#include "esp_event_base.h"
#include <functional>

class Plugin;

extern unsigned char *rule_engine_alexa_triggers[10];
extern unsigned char *rule_engine_touch_triggers[10];
extern unsigned char *rule_engine_bluetooth_triggers[10];
extern unsigned char *rule_engine_hwtimers[4];
extern unsigned char *rule_engine_hwinterrupts[16];

int parse_rules(unsigned char *rules, long len);
uint8_t run_rule(unsigned char* start, unsigned char* start_val, uint8_t start_val_length, uint8_t len);
void run_rules();
void init_rules();
void reload_rules();

void register_command(uint8_t cmd_id, std::function<uint8_t(uint8_t*)> handler);\

void fire_system_event(uint16_t evt_id, uint8_t evt_data_len, uint8_t *evt_data);

ESP_EVENT_DECLARE_BASE(RULE_EVENTS);

enum {
    RULE_USER_EVENT
};

#ifndef rule_event_loop
extern esp_event_loop_handle_t rule_event_loop;
#endif

// #define TRIGGER_EVENT(x) event_triggers[x/8] |= 1 << (x%8)
// #define CLEAR_EVENT(x) event_triggers[x/8] &= ~(1 << (x%8))
// #define IS_EVENT_TRIGGERED(x) (event_triggers[x/8] >> (x%8) & 1) > 0
#define TRIGGER_EVENT(event) ESP_ERROR_CHECK(esp_event_post_to(rule_event_loop, RULE_EVENTS, RULE_USER_EVENT, event, 3 + event[2], portMAX_DELAY));

#define TRIGGER_TIMER(x, time) timers[x] = time; timer_triggers[x/8] |= 1 << (x%8)
#define CLEAR_TIMER(x) timers[x] = 0; timer_triggers[x/8] &= ~(1 << (x%8))
#define IS_TIMER_TRIGGERED(x) timers[x] == 0 && ((timer_triggers[x/8] >> (x%8)) & 1) > 0

#define CMD_HW_INTERRUPT_EN     0xe0
#define CMD_HW_INTERRUPT_DIS    0xe1
#define CMD_HW_TIMER_EN         0xe2
#define CMD_HW_TIMER_DIS        0xe3

#define CMD_MATH    0xee
#define CMD_HTTP    0xef

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

#define TRIG_VAR    0x00
#define TRIG_EVENT  0x01
#define TRIG_TIMER  0x02
#define TRIG_SYS    0x03
#define TRIG_HWTIMER    0x04
#define TRIG_HWINTER    0x05
#define TRIG_ALEXA      0x06
#define TRIG_TOUCH      0x07
#define TRIG_CRON       0x08
#define TRIG_BLUETOOTH  0x09

#endif
