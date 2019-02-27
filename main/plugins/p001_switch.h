#ifndef ESP_PLUGIN_001_H
#define ESP_PLUGIN_001_H

#include "plugin.h"

class SwitchPlugin: public Plugin {
    private:
        int interval = 60;
        int gpio = 255;
        bool state = 0;
        JsonObject *cfg;
    public:
        Plugin* clone() const { 
            ESP_LOGI("PLUGIN", "cloning ...");
            return new SwitchPlugin; 
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