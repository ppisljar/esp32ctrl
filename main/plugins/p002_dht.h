#ifndef ESP_PLUGIN_002_H
#define ESP_PLUGIN_002_H

#include "plugin.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "dht.h"
#include "esp_log.h"

class DHTPlugin: public Plugin {
    private:
        float temperature = 0;
        float humidity = 0;
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
        void* getStatePtr(uint8_t );
        void setStatePtr(uint8_t, uint8_t*);
};

#endif