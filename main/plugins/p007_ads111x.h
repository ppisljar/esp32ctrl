#ifndef ESP_PLUGIN_007_H
#define ESP_PLUGIN_007_H

#include "plugin.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_log.h"
#include "ADS1115.h"

class ADS111xPlugin: public Plugin {
    private:
        int value = 0;
        JsonObject *cfg;
        ADS1115 *adc0;
        uint8_t addr;
        struct IO_ANALOG_PINS pins;
    public:
        Plugin* clone() const {
            return new ADS111xPlugin;
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