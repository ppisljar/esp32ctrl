#ifndef ESP_PLUGIN_c003_H
    #define ESP_PLUGIN_c003_H

    #include "plugin.h"
    #include "../lib/controller.h"
    #include "freertos/FreeRTOS.h"
    #include "freertos/task.h"
    #include "esp_wifi.h"
    #include "esp_log.h"
    #include "esp_event_loop.h"
    #include "lwip/dns.h"
    #include "lwip/err.h"
    #include "lwip/sockets.h"
    #include "lwip/sys.h"
    #include <lwip/netdb.h>


    struct wifi_status_struct {
        bool wifi_connected;
        in_addr_t local_ip;
        uint8_t mac[6];
    };

    class WiFiPlugin: public Plugin {
        
        public:
            wifi_config_t wifi_config;
            struct wifi_status_struct status;
            bool secondarySSID = false;
            
            DEFINE_PLUGIN(WiFiPlugin);
    };

    #endif