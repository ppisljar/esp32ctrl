#ifndef ESP_PLUGIN_006_H
#define ESP_PLUGIN_006_H

#include "plugin_defs.h"
#include "driver/adc.h"
#include "esp_adc_cal.h"

class AnalogPlugin: public Plugin {
    private:
        int value = 0;
    public:
        DEFINE_PPLUGIN(AnalogPlugin, 6);

        static void task(void *pvParameters);
};

#endif