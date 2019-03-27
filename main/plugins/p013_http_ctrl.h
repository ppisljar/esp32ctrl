#ifndef ESP_PLUGIN_013_H
#define ESP_PLUGIN_013_H

#include "utils.h"
#include "plugin.h"
#include "../lib/controller.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_log.h"
#include "esp_http_client.h"
#include <functional>
#include <sstream>
#include <bits/stdc++.h> 

class HTTPCtrlPlugin: public Plugin {
    private:
        int value = 0;
        
    public:
        bool connected = false;
        esp_http_client_config_t http_cfg = {};
        esp_http_client_handle_t client = {};

        DEFINE_PLUGIN(HTTPCtrlPlugin);

        void request(const char *uri, esp_http_client_method_t method, const char* data = nullptr);
};

#endif