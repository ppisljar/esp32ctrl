#ifndef ESP_PLUGIN_013_H
#define ESP_PLUGIN_013_H

#include "plugin_defs.h"
#include "esp_http_client.h"
#include <functional>

class HTTPCtrlPlugin: public Plugin {
    private:
        int value = 0;
        Type value_t = Type::integer;
    public:
        bool connected = false;
        esp_http_client_config_t http_cfg = {};
        esp_http_client_handle_t client = {};

        DEFINE_PPLUGIN(HTTPCtrlPlugin, 13);

        void request(const char *uri, esp_http_client_method_t method, const char* data = nullptr);
};

#endif