#ifndef ESP_PLUGIN_004_H
#define ESP_PLUGIN_004_H

#include "plugin.h"
#include "esp_log.h"
#include "ds18x20.h"

class DS18x20Plugin: public Plugin {
    private:
        float temperature[16];
        ds18x20_addr_t addrs[16];
        int sensor_count;
        JsonObject *cfg;
    public:
        Plugin* clone() const {
            return new DS18x20Plugin;
        }

        bool init(JsonObject &params);
        bool setState(JsonObject &params);
        bool setConfig(JsonObject &params);
        bool getState(JsonObject& );
        bool getConfig(JsonObject& );
        static void task(void *pvParameters);
};

#endif