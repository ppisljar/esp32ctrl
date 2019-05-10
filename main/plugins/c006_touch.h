#ifndef ESP_PLUGIN_c006_H
#define ESP_PLUGIN_c006_H

#include "plugin.h"
#include "freertos/FreeRTOS.h"
#include "../lib/rule_engine.h"

#include "driver/touch_pad.h"
#include "soc/rtc_cntl_reg.h"
#include "soc/sens_reg.h"

#define TOUCH_THRESH_NO_USE   (0)
#define TOUCH_THRESH_PERCENT  (80)
#define TOUCHPAD_FILTER_TOUCH_PERIOD (10)

class TouchPlugin: public Plugin {
    
    public:
        uint8_t state;
        Type state_t = Type::byte;
        DEFINE_PLUGIN(TouchPlugin);

        static void task(void *pvParameters);
};

#endif