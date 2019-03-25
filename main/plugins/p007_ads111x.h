#ifndef ESP_PLUGIN_007_H
#define ESP_PLUGIN_007_H

#include "plugin.h"
#include "../lib/controller.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_log.h"
#include "ADS1115.h"

class ADS111xPlugin: public Plugin {
    private:
        int value = 0;
        ADS1115 *adc0;
        uint8_t addr;
        struct IO_DIGITAL_PINS pins;
    public:
        DEFINE_PLUGIN(ADS111xPlugin);
};

#endif