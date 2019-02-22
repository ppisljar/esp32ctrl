#ifndef ESP_PLUGIN_003_H
#define ESP_PLUGIN_003_H

#include "plugin.h"
#include "esp_log.h"

class BMP280Plugin: public Plugin {
    private:
        float temperature;
        float pressure;
        float humidity;
        int type = 0;
        JsonObject *cfg;
    public:
        Plugin* clone() const {
            return new BMP280Plugin;
        }

        bool init(JsonObject &params);
        bool setState(JsonObject &params);
        bool setConfig(JsonObject &params);
        bool getState(JsonObject& );
        bool getConfig(JsonObject& );
        static void task(void *pvParameters);
};

#endif