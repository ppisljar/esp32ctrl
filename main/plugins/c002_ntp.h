#ifndef ESP_PLUGIN_c002_H
    #define ESP_PLUGIN_c002_H

    #include "plugin.h"
    #include "freertos/FreeRTOS.h"
    #include "freertos/task.h"
    #include "esp_log.h"
    #include "lwip/err.h"
    #include "lwip/apps/sntp.h"

    class NTPPlugin: public Plugin {
        private:
            bool state;
            JsonObject *cfg;
            time_t current_time;
        public:
            Plugin* clone() const {
                return new NTPPlugin;
            }

            bool init(JsonObject &params);
            bool setState(JsonObject &params);
            bool setConfig(JsonObject &params);
            bool getState(JsonObject& );
            bool getConfig(JsonObject& );
            void* getStatePtr(uint8_t );
            void setStatePtr(uint8_t, uint8_t*);
            void getTime(const char *);
    };

    #endif