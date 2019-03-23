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

    #define TIMER_SCALE(divider)           (TIMER_BASE_CLK / divider)  // convert counter value to seconds
    #define ESP_INTR_FLAG_DEFAULT 0
    /*
    * A sample structure to pass events
    * from the timer interrupt handler to the main program.
    */
    typedef struct {
        int type;  // the type of timer's event
        int timer_group;
        int timer_idx;
        uint64_t timer_counter_value;
    } timer_event_t;

    xQueueHandle timer_queue;
    xQueueHandle gpio_evt_queue;

    class TimersPlugin: public Plugin {
        
        public:
            JsonObject *cfg;
            uint8_t state;
            
            Plugin* clone() const {
                return new TimersPlugin;
            }

            bool init(JsonObject &params);
            bool setState(JsonObject &params);
            bool setConfig(JsonObject &params);
            bool getState(JsonObject& );
            bool getConfig(JsonObject& );
            void* getStatePtr(uint8_t );
            void setStatePtr(uint8_t, uint8_t*);
    };

    #endif