#ifndef ESP_PLUGIN_002_H
#define ESP_PLUGIN_002_H

#include "plugin_defs.h"
#include "tinyexpr.h"
#include "dht.h"

class DHTPlugin: public Plugin {
    private:
        float temperature = 0;
        float humidity = 0;

        float temp[2];
        TaskHandle_t task_h;
    public:
        DEFINE_PPLUGIN(DHTPlugin, 2);

        te_expr *temp_expr;
        te_expr *humi_expr;

        static void task(void *pvParameters);
};

#endif