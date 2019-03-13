#ifndef ESP_PLUGIN_c003_H
    #define ESP_PLUGIN_c003_H

    #include "plugin.h"
    #include "freertos/FreeRTOS.h"
    #include "freertos/task.h"
    #include "esp_wifi.h"
    #include "esp_log.h"
    #include "esp_event_loop.h"
    #include "lwip/dns.h"


    struct wifi_status_struct {
        bool wifi_connected;
    };

    class WiFiPlugin: public Plugin {
        
        public:
            JsonObject *cfg;
            wifi_config_t wifi_config;
            struct wifi_status_struct status;
            bool secondarySSID = false;
            
            Plugin* clone() const {
                return new WiFiPlugin;
            }

            bool init(JsonObject &params);
            bool setState(JsonObject &params);
            bool setConfig(JsonObject &params);
            bool getState(JsonObject& );
            bool getConfig(JsonObject& );
            void* getStatePtr(uint8_t );
            void setStatePtr(uint8_t, uint8_t*);
    };

    #endif