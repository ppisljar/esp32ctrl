#ifndef ESP_PLUGIN_002_H
#define ESP_PLUGIN_002_H

#include "plugin_defs.h"
#include "tinyexpr.h"
#include "dht.h"

class DHTPlugin: public Plugin {
    private:
        double temperature = 0;
        double humidity = 0;
        Type temperature_t = Type::decimal;
        Type humidity_t = Type::decimal;

        double temp[2];
        TaskHandle_t task_h;
    public:
        DEFINE_PPLUGIN(DHTPlugin, 2);

        te_expr *temp_expr;
        te_expr *humi_expr;

        static void task(void *pvParameters);
};

#endif