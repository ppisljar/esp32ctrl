#include "p013_http_ctrl.h"

static const char *TAG = "HTTPCtrlPlugin";

PLUGIN_CONFIG(HTTPCtrlPlugin, uri, data, method)
PLUGIN_STATS(HTTPCtrlPlugin, value, value)

class HTTP_Notify : public Controller_Notify_Handler {
    private:
        char topic[64];
        char data[64];
        HTTPCtrlPlugin* p;
    public:
        HTTP_Notify(HTTPCtrlPlugin* parent) {     
                p = parent;
        };
        uint8_t operator()(Plugin *x, uint8_t var_id, void *val1, uint8_t val_type) {
            uint8_t val = *(uint8_t*)val1;
            ESP_LOGI(TAG, "sending http notification %p %d %d", p, var_id, val);
            JsonObject &cfg = *(p->cfg);
            const char *uri_format = cfg["uri"];
            const char *data_format = cfg["data"];
            uint8_t method = cfg["method"] | 0;
            std::string uri_str(uri_format);
            std::string data_str(data_format);
            // // we need to have parse function which will parse the topic/data format and do string replacement for vars
            parseStrForVar(uri_str, x, var_id, val);
            parseStrForVar(data_str, x, var_id, val);
            ESP_LOGI(TAG, "%s\n%s", uri_str.c_str(), data_str.c_str());

            p->request(uri_str.c_str(), (esp_http_client_method_t)method, data_str.c_str());
            
            return 0;
        }
};

bool HTTPCtrlPlugin::init(JsonObject &params) {
    cfg = &((JsonObject &)params["params"]);
    state_cfg = &((JsonArray &)params["state"]);

    http_cfg.url = (*cfg)["uri"].as<char*>();

    client = esp_http_client_init(&http_cfg);

    HTTP_Notify *notify = new HTTP_Notify(this);
    registerController(notify);

    // uint8_t cnt = 0;
    // while (!connected && cnt < 50) {
    //     cnt++;
    //     vTaskDelay( 100 / portTICK_PERIOD_MS);
    // }

    return true;
}
//extern WiFiPlugin *wifi_plugin;

void HTTPCtrlPlugin::request(const char *uri, esp_http_client_method_t method, const char* data) {
    //if (!wifi_plugin->status.connected) return;

    esp_http_client_set_url(client, uri);
    esp_http_client_set_method(client, method);
    esp_err_t err = esp_http_client_perform(client);

    if (err == ESP_OK) {
        ESP_LOGI(TAG, "Status = %d, content_length = %d",
            esp_http_client_get_status_code(client),
            esp_http_client_get_content_length(client));
    }
}

HTTPCtrlPlugin::~HTTPCtrlPlugin() {
    
}
