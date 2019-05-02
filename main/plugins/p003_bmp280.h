#ifndef ESP_PLUGIN_003_H
#define ESP_PLUGIN_003_H

#include "plugin_defs.h"
#include <iot_bme280.h>

class BMP280Plugin: public Plugin {
    private:
        float temperature = 0;
        float pressure = 0;
        float humidity = 0;
        int type = 0;
        float temp[3];
    public:
        DEFINE_PPLUGIN(BMP280Plugin, 3);

        bme280_config_t dev = {};

        te_expr *temp_expr;
        te_expr *humi_expr;
        te_expr *pres_expr;

        static void task(void *pvParameters);
};

#endif