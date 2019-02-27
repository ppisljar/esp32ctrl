#ifndef ESP_PLUGIN_005_H
#define ESP_PLUGIN_005_H

#include "plugin.h"
#include "esp_log.h"

class RegulatorPlugin: public Plugin {
    private:
        bool output = 0;
        JsonObject *cfg;
        StaticJsonBuffer<JSON_OBJECT_SIZE(3)> jb;
    public:
        Plugin* clone() const {
            return new RegulatorPlugin;
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