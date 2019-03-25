#ifndef ESP_PLUGIN_006_H
#define ESP_PLUGIN_006_H

#include "plugin.h"
#include "../lib/controller.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_log.h"
#include "driver/adc.h"
#include "esp_adc_cal.h"

class AnalogPlugin: public Plugin {
    private:
        int value = 0;
    public:
        DEFINE_PLUGIN(AnalogPlugin);

        static void task(void *pvParameters);
};

#endif