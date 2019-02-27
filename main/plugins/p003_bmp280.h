#ifndef ESP_PLUGIN_003_H
#define ESP_PLUGIN_003_H

#include "plugin.h"
#include "esp_log.h"
#include <bmp280.h>

class BMP280Plugin: public Plugin {
    private:
        float temperature = 0;
        float pressure = 0;
        float humidity = 0;
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
        void* getStatePtr(uint8_t );
        void setStatePtr(uint8_t, uint8_t*);
        static void task(void *pvParameters);
};

#endif