#ifndef ESP_PLUGIN_008_H
#define ESP_PLUGIN_008_H

#include "plugin.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_log.h"
#include "mcp23017.h"

class MCP23017Plugin: public Plugin {
    private:
        int value = 0;
        JsonObject *cfg;
        uint8_t addr;
        struct IO_DIGITAL_PINS pins;
    public:
        Plugin* clone() const {
            return new MCP23017Plugin;
        }

        bool init(JsonObject &params);
        bool setState(JsonObject &params);
        bool setConfig(JsonObject &params);
        bool getState(JsonObject& );
        bool getConfig(JsonObject& );
        static void task(void *pvParameters);
        void* getStatePtr(uint8_t );
        void setStatePtr(uint8_t, uint8_t*);

        static esp_err_t setDirection(uint8_t, uint8_t);
        static esp_err_t digitalWrite(uint8_t, uint8_t);
        static uint8_t digitalRead(uint8_t);
};

#endif