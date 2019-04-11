#ifndef ESP_PLUGIN_c004_H
#define ESP_PLUGIN_c004_H

#include "plugin.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"
#include "soc/timer_group_struct.h"
#include "driver/periph_ctrl.h"
#include "driver/timer.h"
#include "driver/gpio.h"
#include "../lib/rule_engine.h"

#define TIMER_SCALE(divider)           (TIMER_BASE_CLK / divider)  // convert counter value to seconds
#define ESP_INTR_FLAG_DEFAULT 0
/*
* A sample structure to pass events
* from the timer interrupt handler to the main program.
*/
typedef struct {
    int type;  // the type ofevent: 0 = timer, 1 = gpio
    int id; // id of trigger (with timer its timerid, with gpio its gpioid)
    uint64_t value; // timer value
} timer_event_t;



class TimersPlugin: public Plugin {
    
    public:
        uint8_t state;
        
        DEFINE_PLUGIN(TimersPlugin);

        void enableHwInterrupt(uint8_t pin, gpio_int_type_t type = GPIO_INTR_ANYEDGE);
};

#endif