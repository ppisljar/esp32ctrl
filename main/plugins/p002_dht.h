#ifndef ESP_PLUGIN_002_H
#define ESP_PLUGIN_002_H

#include "plugin.h"
#include "../lib/controller.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "dht.h"
#include "esp_log.h"

class DHTPlugin: public Plugin {
    private:
        float temperature = 0;
        float humidity = 0;

        float temp[2];
    public:
        DEFINE_PLUGIN(DHTPlugin);

        te_expr *temp_expr;
        te_expr *humi_expr;

        static void task(void *pvParameters);
};

#endif