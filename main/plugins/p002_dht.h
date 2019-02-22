#ifndef ESP_PLUGIN_002_H
#define ESP_PLUGIN_002_H

#include "plugin.h"
#include "esp_log.h"

class DHTPlugin: public Plugin {
    private:
        int16_t temperature;
        int16_t humidity;
        JsonObject *cfg;
    public:
        Plugin* clone() const {
            return new DHTPlugin;
        }

        bool init(JsonObject &params);
        bool setState(JsonObject &params);
        bool setConfig(JsonObject &params);
        bool getState(JsonObject& );
        bool getConfig(JsonObject& );
        static void task(void *pvParameters);
};

#endif