#ifndef ESP_PLUGIN_011_H
#define ESP_PLUGIN_011_H

#include "plugin.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_log.h"
#include "mqtt_client.h"

class MQTTPlugin: public Plugin {
    private:
        int value = 0;
        JsonObject *cfg;
    public:
        Plugin* clone() const {
            return new MQTTPlugin;
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