#ifndef ESP_PLUGIN_001_H
#define ESP_PLUGIN_001_H

#include "plugin.h"
#include "esp_log.h"

class SwitchPlugin: public Plugin {
    private:
        int interval;
        int gpio;
        bool state;
        StaticJsonBuffer<JSON_OBJECT_SIZE(3)> jb;
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
        static void task(void *pvParameters);
};

#endif