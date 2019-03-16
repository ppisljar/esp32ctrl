#include "c004_timers.h"

static const char *TAG = "TimersPlugin";

// todo: 
// - start, stop, pause from rules
// - set alarm value
// - set alarm event
// - checking timer queue for new alerts


PLUGIN_CONFIG(TimersPlugin, t1_enabled, t2_enabled, t3_enabled, t4_enabled)
PLUGIN_STATS(TimersPlugin, state, state)

/*
 * Timer group0 ISR handler
 *
 * Note:
 * We don't call the timer API here because they are not declared with IRAM_ATTR.
 * If we're okay with the timer irq not being serviced while SPI flash cache is disabled,
 * we can allocate this interrupt without the ESP_INTR_FLAG_IRAM flag and use the normal API.
 */
void IRAM_ATTR timer_group0_isr(void *para)
{
    int timer_idx = (int) para;

    /* Retrieve the interrupt status and the counter value
       from the timer that reported the interrupt */
    uint32_t intr_status = TIMERG0.int_st_timers.val;
    TIMERG0.hw_timer[timer_idx].update = 1;
    uint64_t timer_counter_value = 
        ((uint64_t) TIMERG0.hw_timer[timer_idx].cnt_high) << 32
        | TIMERG0.hw_timer[timer_idx].cnt_low;

    /* Prepare basic event data
       that will be then sent back to the main program task */
    timer_event_t evt;
    evt.timer_group = 0;
    evt.timer_idx = timer_idx;
    evt.timer_counter_value = timer_counter_value;

    /* Clear the interrupt
       and update the alarm time for the timer with without reload */
    if ((intr_status & BIT(timer_idx)) && timer_idx == TIMER_0) {
        TIMERG0.int_clr_timers.t0 = 1;
    } else if ((intr_status & BIT(timer_idx)) && timer_idx == TIMER_1) {
        TIMERG0.int_clr_timers.t1 = 1;
    } else {
        
    }

    /* After the alarm has been triggered
      we need enable it again, so it is triggered the next time */
    TIMERG0.hw_timer[timer_idx].config.alarm_en = TIMER_ALARM_EN;

    /* Now just send the event data back to the main program task */
    xQueueSendFromISR(timer_queue, &evt, NULL);
}

void IRAM_ATTR timer_group1_isr(void *para)
{
    int timer_idx = (int) para;

    /* Retrieve the interrupt status and the counter value
       from the timer that reported the interrupt */
    uint32_t intr_status = TIMERG1.int_st_timers.val;
    TIMERG1.hw_timer[timer_idx].update = 1;
    uint64_t timer_counter_value = 
        ((uint64_t) TIMERG1.hw_timer[timer_idx].cnt_high) << 32
        | TIMERG1.hw_timer[timer_idx].cnt_low;

    /* Prepare basic event data
       that will be then sent back to the main program task */
    timer_event_t evt;
    evt.timer_group = 1;
    evt.timer_idx = timer_idx;
    evt.timer_counter_value = timer_counter_value;

    /* Clear the interrupt
       and update the alarm time for the timer with without reload */
    if ((intr_status & BIT(timer_idx)) && timer_idx == TIMER_0) {
        TIMERG1.int_clr_timers.t0 = 1;
    } else if ((intr_status & BIT(timer_idx)) && timer_idx == TIMER_1) {
        TIMERG1.int_clr_timers.t1 = 1;
    } else {
        
    }

    /* After the alarm has been triggered
      we need enable it again, so it is triggered the next time */
    TIMERG1.hw_timer[timer_idx].config.alarm_en = TIMER_ALARM_EN;

    /* Now just send the event data back to the main program task */
    xQueueSendFromISR(timer_queue, &evt, NULL);
}

bool TimersPlugin::init(JsonObject &params) {
    cfg = &params;   

    uint16_t divider;
    uint8_t mode;
    uint8_t auto_reload = 1;

    // GROUP0 TIMER0 (timer 1)
    if (params["t1_enabled"]) {
        divider = params["t1_divider"] | 800;
        mode = params["t1_mode"] | 0;
        auto_reload = 1;
        /* Select and initialize basic parameters of the timer */
        timer_config_t config;
        config.divider = divider;
        config.counter_dir = (timer_count_dir_t)mode;
        config.counter_en = TIMER_PAUSE;
        config.alarm_en = TIMER_ALARM_EN;
        config.intr_type = TIMER_INTR_LEVEL;
        config.auto_reload = auto_reload;
        timer_init(TIMER_GROUP_0, (timer_idx_t)0, &config);

        /* Timer's counter will initially start from value below.
        Also, if auto_reload is set, this value will be automatically reload on alarm */
        timer_set_counter_value(TIMER_GROUP_0, (timer_idx_t)0, 0x00000000ULL);

        /* Configure the alarm value and the interrupt on alarm. */
        //timer_set_alarm_value(TIMER_GROUP_0, (timer_idx_t)0, timer_interval_sec * TIMER_SCALE(divider));
        timer_enable_intr(TIMER_GROUP_0, (timer_idx_t)0);
        timer_isr_register(TIMER_GROUP_0, (timer_idx_t)0, timer_group0_isr, (void *) 0, ESP_INTR_FLAG_IRAM, NULL);
    }

    // GROUP0 TIMER1 (timer 2)
    if (params["t2_enabled"]) {
        divider = params["t2_divider"] | 800;
        mode = params["t2_mode"] | 0;
        auto_reload = 1;
        /* Select and initialize basic parameters of the timer */
        timer_config_t config2;
        config2.divider = divider;
        config2.counter_dir = (timer_count_dir_t)mode;
        config2.counter_en = TIMER_PAUSE;
        config2.alarm_en = TIMER_ALARM_EN;
        config2.intr_type = TIMER_INTR_LEVEL;
        config2.auto_reload = auto_reload;
        timer_init(TIMER_GROUP_0, (timer_idx_t)1, &config2);

        /* Timer's counter will initially start from value below.
        Also, if auto_reload is set, this value will be automatically reload on alarm */
        timer_set_counter_value(TIMER_GROUP_0, (timer_idx_t)1, 0x00000000ULL);

        /* Configure the alarm value and the interrupt on alarm. */
        //timer_set_alarm_value(TIMER_GROUP_0, (timer_idx_t)1, timer_interval_sec * TIMER_SCALE(divider));
        timer_enable_intr(TIMER_GROUP_0, (timer_idx_t)1);
        timer_isr_register(TIMER_GROUP_0, (timer_idx_t)1, timer_group0_isr, (void *) 1, ESP_INTR_FLAG_IRAM, NULL);
    }

    // GROUP1 TIMER0 (timer 3)
    if (params["t3_enabled"]) {
        divider = params["t1_divider"] | 800;
        mode = params["t1_mode"] | 0;
        auto_reload = 1;
        /* Select and initialize basic parameters of the timer */
        timer_config_t config3;
        config3.divider = divider;
        config3.counter_dir = (timer_count_dir_t)mode;
        config3.counter_en = TIMER_PAUSE;
        config3.alarm_en = TIMER_ALARM_EN;
        config3.intr_type = TIMER_INTR_LEVEL;
        config3.auto_reload = auto_reload;
        timer_init(TIMER_GROUP_1, (timer_idx_t)0, &config3);

        /* Timer's counter will initially start from value below.
        Also, if auto_reload is set, this value will be automatically reload on alarm */
        timer_set_counter_value(TIMER_GROUP_1, (timer_idx_t)0, 0x00000000ULL);

        /* Configure the alarm value and the interrupt on alarm. */
        //timer_set_alarm_value(TIMER_GROUP_1, (timer_idx_t)0, timer_interval_sec * TIMER_SCALE(divider));
        timer_enable_intr(TIMER_GROUP_1, (timer_idx_t)0);
        timer_isr_register(TIMER_GROUP_1, (timer_idx_t)0, timer_group1_isr, (void *) 0, ESP_INTR_FLAG_IRAM, NULL);
    }

    // GROUP1 TIMER1 (timer 4)
    if (params["t4_enabled"]) {
        divider = params["t1_divider"] | 800;
        mode = params["t1_mode"] | 0;
        auto_reload = 1;
        /* Select and initialize basic parameters of the timer */
        timer_config_t config4;
        config4.divider = divider;
        config4.counter_dir = (timer_count_dir_t)mode;
        config4.counter_en = TIMER_PAUSE;
        config4.alarm_en = TIMER_ALARM_EN;
        config4.intr_type = TIMER_INTR_LEVEL;
        config4.auto_reload = auto_reload;
        timer_init(TIMER_GROUP_1, (timer_idx_t)1, &config4);

        /* Timer's counter will initially start from value below.
        Also, if auto_reload is set, this value will be automatically reload on alarm */
        timer_set_counter_value(TIMER_GROUP_1, (timer_idx_t)1, 0x00000000ULL);

        /* Configure the alarm value and the interrupt on alarm. */
        //timer_set_alarm_value(TIMER_GROUP_1, (timer_idx_t)1, timer_interval_sec * TIMER_SCALE(divider));
        timer_enable_intr(TIMER_GROUP_1, (timer_idx_t)1);
        timer_isr_register(TIMER_GROUP_1, (timer_idx_t)1, timer_group1_isr, (void *) 0, ESP_INTR_FLAG_IRAM, NULL);
    }
    

    return true;
}

