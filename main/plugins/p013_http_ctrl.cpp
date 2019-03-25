#include "p013_http_ctrl.h"

static const char *TAG = "HTTPCtrlPlugin";

PLUGIN_CONFIG(HTTPCtrlPlugin, uri, data, method)
PLUGIN_STATS(HTTPCtrlPlugin, value, value)

bool replace_string_in_place(std::string& subject, const std::string& search,
                          const std::string& replace) {
    size_t pos = 0;
    bool success = false;
    while((pos = subject.find(search, pos)) != std::string::npos) {
         subject.replace(pos, search.length(), replace);
         pos += replace.length();
         success = true;
    }
    return success;
}

static void parseStr(std::string& str, Plugin *p, uint8_t var_id, uint8_t val) {
    std::string name(p->name);
    replace_string_in_place(str, "%device_id%", std::to_string(p->id));
    replace_string_in_place(str, "%device_name%", name);
    replace_string_in_place(str, "%value_id%", std::to_string(var_id));
    replace_string_in_place(str, "%value_name%", "test");
    replace_string_in_place(str, "%idx%", "test");
    replace_string_in_place(str, "%unit_id%", "test");
    replace_string_in_place(str, "%unit_name%", "test");
    replace_string_in_place(str, "%timestamp%", "test");
    replace_string_in_place(str, "%value%", std::to_string(val));
}

// TODO: we need a way to register to additional topics (from rules) and have separate handler for those (update should be called only for default topic)
// static esp_err_t mqtt_event_handler(esp_mqtt_event_handle_t event)
// {
//     esp_mqtt_client_handle_t client = event->client;
//     HTTPCtrlPlugin *p = (HTTPCtrlPlugin*)event->user_context;
//     int msg_id;
//     // your_context_t *context = event->context;
//     switch (event->event_id) {
//         case MQTT_EVENT_CONNECTED:
//             p->connected = true;
//             ESP_LOGI(TAG, "MQTT_EVENT_CONNECTED");
//             break;
//         case MQTT_EVENT_DISCONNECTED:
//             p->connected = false;
//             ESP_LOGI(TAG, "MQTT_EVENT_DISCONNECTED");
//             break;

//         case MQTT_EVENT_SUBSCRIBED:
//             ESP_LOGI(TAG, "MQTT_EVENT_SUBSCRIBED, msg_id=%d", event->msg_id);
//             break;
//         case MQTT_EVENT_UNSUBSCRIBED:
//             ESP_LOGI(TAG, "MQTT_EVENT_UNSUBSCRIBED, msg_id=%d", event->msg_id);
//             break;
//         case MQTT_EVENT_PUBLISHED:
//             ESP_LOGI(TAG, "MQTT_EVENT_PUBLISHED, msg_id=%d", event->msg_id);
//             break;
//         case MQTT_EVENT_DATA:
//             ESP_LOGI(TAG, "MQTT_EVENT_DATA");
//             // todo: we need to call update method
//             // -- parse out data as described in data format    
//             //ESP_LOGI(TAG, "handler: %p", p->registeredTopics["update/+/+"]);
//             //p->registeredTopics["update/+/+"](event->topic, event->data);   
//             p->handler(event->topic, event->topic_len, event->data);
//             break;
//         case MQTT_EVENT_ERROR:
//             ESP_LOGI(TAG, "MQTT_EVENT_ERROR");
//             break;
//         default:
//             ESP_LOGI(TAG, "Other event id:%d", event->event_id);
//             break;
//     }
//     return ESP_OK;
// }


class HTTP_Notify : public Controller_Notify_Handler {
    private:
        char topic[64];
        char data[64];
        HTTPCtrlPlugin* p;
    public:
        HTTP_Notify(HTTPCtrlPlugin* parent) {     
                p = parent;
        };
        uint8_t operator()(Plugin *x, uint8_t var_id, uint8_t val) {
            ESP_LOGI(TAG, "sending http notification %p %d %d", p, var_id, val);
            JsonObject &cfg = *(p->cfg);
            const char *uri_format = cfg["uri"];
            const char *data_format = cfg["data"];
            uint8_t method = cfg["method"] | 0;
            std::string uri_str(uri_format);
            std::string data_str(data_format);
            // // we need to have parse function which will parse the topic/data format and do string replacement for vars
            parseStr(uri_str, x, var_id, val);
            parseStr(data_str, x, var_id, val);
            ESP_LOGI(TAG, "%s\n%s", uri_str.c_str(), data_str.c_str());

            p->request(uri_str.c_str(), (esp_http_client_method_t)method, data_str.c_str());
            
            return 0;
        }
};

bool HTTPCtrlPlugin::init(JsonObject &params) {
    cfg = &((JsonObject &)params["params"]);

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

void HTTPCtrlPlugin::request(const char *uri, esp_http_client_method_t method, const char* data) {
    esp_http_client_set_url(client, uri);
    esp_http_client_set_method(client, method);
    esp_err_t err = esp_http_client_perform(client);

    if (err == ESP_OK) {
        ESP_LOGI(TAG, "Status = %d, content_length = %d",
            esp_http_client_get_status_code(client),
            esp_http_client_get_content_length(client));
    }
}