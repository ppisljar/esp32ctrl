#ifndef ESP_PLUGIN_010_H
#define ESP_PLUGIN_010_H

#include "plugin.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_log.h"
#include "pca9685.h"

class PCA9685Plugin: public Plugin {
    private:
        int value = 0;
        JsonObject *cfg;
        uint8_t addr;
        struct IO_ANALOG_PINS pins;
    public:
        Plugin* clone() const {
            return new PCA9685Plugin;
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