#ifndef ESP_PLUGIN_006_H
#define ESP_PLUGIN_006_H

#include "plugin_defs.h"
#include "driver/adc.h"
#include "esp_adc_cal.h"
#include "tinyexpr.h"

class AnalogPlugin: public Plugin {
    private:
        double value = 0;
        double temp = 0;
        Type value_t = Type::decimal;
        TaskHandle_t task_h;
    public:
        DEFINE_PPLUGIN(AnalogPlugin, 6);
        te_expr *expr;
        static void task(void *pvParameters);
};

#endif