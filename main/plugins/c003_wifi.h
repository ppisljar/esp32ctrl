#ifndef ESP_PLUGIN_c003_H
#define ESP_PLUGIN_c003_H

#include "plugin.h"
#include "../lib/controller.h"
#include "../lib/io.h"
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

extern IO io;

// connect to SSID 1
// fails ? retry
// fails ? try SSID 2
// fails ? retry
// fails ? were we connected to 2 ? if not STA


struct wifi_status_struct {
    uint8_t wifi_connected;
    Type wifi_connected_t = Type::byte;
    in_addr_t local_ip;
    uint8_t mac[6];
};

class WiFiPlugin: public Plugin {
    
    public:
        wifi_config_t wifi_config = {};
        struct wifi_status_struct status;
        bool secondarySSID = false;

        uint8_t failed_1 = 0;
        uint8_t failed_2 = 0;
        
        DEFINE_PLUGIN(WiFiPlugin);

        static void task(void *pvParameters);
};

#endif