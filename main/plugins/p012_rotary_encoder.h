#ifndef ESP_PLUGIN_012_H
#define ESP_PLUGIN_012_H

#include "plugin.h"
#include "../lib/controller.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_log.h"

class RotaryEncoderPlugin: public Plugin {
    private:
        int value = 0;
        
    public:
        DEFINE_PLUGIN(RotaryEncoderPlugin);

};

#endif