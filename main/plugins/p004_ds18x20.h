#ifndef ESP_PLUGIN_004_H
#define ESP_PLUGIN_004_H

#include "plugin.h"
#include "../lib/controller.h"
#include "esp_log.h"
#include "ds18x20.h"

class DS18x20Plugin: public Plugin {
    private:
        float temperature[16];
        ds18x20_addr_t addrs[16];
        int sensor_count = 0;
    public:
        DEFINE_PLUGIN(DS18x20Plugin);
        static void task(void *pvParameters);
};

#endif