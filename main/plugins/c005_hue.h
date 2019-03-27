#ifndef ESP_PLUGIN_c005_H
#define ESP_PLUGIN_c005_H

#include "plugin.h"
#include "freertos/FreeRTOS.h"
#include "espalexa.h"
#include "../lib/file_server.h"
#include "c003_wifi.h"

extern WiFiPlugin *wifi_plugin;

class HueEmulatorPlugin: public Plugin {
    
    public:
        uint8_t state;
        Espalexa *alexa;
        DEFINE_PLUGIN(HueEmulatorPlugin);

        static void task(void *pvParameters);
};

esp_err_t hueemulator_webhandler(httpd_req_t *req);

#endif