#include "p011_mqtt.h"

static const char *TAG = "MQTTPlugin";

PLUGIN_CONFIG(MQTTPlugin, interval, uri, client_id, user, pass, lwt_topic, lwt_msg)
PLUGIN_STATS(MQTTPlugin, value, value)

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

// parses topic and ges out the atual subscribe topic (with wildcards)
static void parseSubscribeTopicStr(std::string &str, struct subscribe_info *info) {
    replace_string_in_place(str, "%unit_id%", "test");
    replace_string_in_place(str, "%unit_name%", "test");
    replace_string_in_place(str, "%timestamp%", "test");

    std::string regex(str);
    std::string topic(str);

    replace_string_in_place(str, "%device_id%", "+");
    replace_string_in_place(str, "%device_name%", "+");
    replace_string_in_place(str, "%value_id%", "+");
    replace_string_in_place(str, "%value_name%", "+");
    replace_string_in_place(str, "%idx%", "+");
    replace_string_in_place(str, "%value%", "+");

    
    strcpy(info->topic, str.c_str());  
    ESP_LOGI(TAG, "parsed topic: %s", info->topic);

    replace_string_in_place(regex, "%device_id%", "(.*?)");
    replace_string_in_place(regex, "%device_name%", "(.*?)");
    replace_string_in_place(regex, "%value_id%", "(.*?)");
    replace_string_in_place(regex, "%value_name%", "(.*?)");
    replace_string_in_place(regex, "%idx%", "(.*?)");
    replace_string_in_place(regex, "%value%", "(.*?)");

    ESP_LOGI(TAG, "parsed regex: %s", regex.c_str());
    std::regex reg(regex);
    info->re.assign(reg);

    std::smatch topic_match;
    if (std::regex_match(topic, topic_match, reg)) {
        for (size_t i = 0; i < topic_match.size(); ++i) {
            printf("%s", topic_match[i].str().c_str());
            if (strcmp(topic_match[i].str().c_str(), "%device_id%") == 0 || strcmp(topic_match[i].str().c_str(), "%device_name%") == 0) {
                info->device_id_group = i;
            }
            if (strcmp(topic_match[i].str().c_str(), "%value_id%") == 0 || strcmp(topic_match[i].str().c_str(), "%value_name%") == 0) {
                info->value_id_group = i;
            }
        }
    }

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
static esp_err_t mqtt_event_handler(esp_mqtt_event_handle_t event)
{
    esp_mqtt_client_handle_t client = event->client;
    MQTTPlugin *p = (MQTTPlugin*)event->user_context;
    int msg_id;
    // your_context_t *context = event->context;
    switch (event->event_id) {
        case MQTT_EVENT_CONNECTED:
            p->connected = true;
            ESP_LOGI(TAG, "MQTT_EVENT_CONNECTED");
            break;
        case MQTT_EVENT_DISCONNECTED:
            p->connected = false;
            ESP_LOGI(TAG, "MQTT_EVENT_DISCONNECTED");
            break;

        case MQTT_EVENT_SUBSCRIBED:
            ESP_LOGI(TAG, "MQTT_EVENT_SUBSCRIBED, msg_id=%d", event->msg_id);
            break;
        case MQTT_EVENT_UNSUBSCRIBED:
            ESP_LOGI(TAG, "MQTT_EVENT_UNSUBSCRIBED, msg_id=%d", event->msg_id);
            break;
        case MQTT_EVENT_PUBLISHED:
            ESP_LOGI(TAG, "MQTT_EVENT_PUBLISHED, msg_id=%d", event->msg_id);
            break;
        case MQTT_EVENT_DATA:
            ESP_LOGI(TAG, "MQTT_EVENT_DATA");
            printf("TOPIC=%.*s\r\n", event->topic_len, event->topic);
            printf("DATA=%.*s\r\n", event->data_len, event->data);
            // todo: we need to call update method
            // -- parse out data as described in data format    
            p->registeredTopics["update/+/+"](event->topic, event->data);   
            break;
        case MQTT_EVENT_ERROR:
            ESP_LOGI(TAG, "MQTT_EVENT_ERROR");
            break;
        default:
            ESP_LOGI(TAG, "Other event id:%d", event->event_id);
            break;
    }
    return ESP_OK;
}


class MQTT_Notify : public Controller_Notify_Handler {
    private:
        char topic[64];
        char data[64];
        MQTTPlugin* p;
    public:
        MQTT_Notify(MQTTPlugin* parent) { 
                
                p = parent;
        };
        uint8_t operator()(Plugin *x, uint8_t var_id, uint8_t val) {
            ESP_LOGI(TAG, "sending mqtt notification %p %d %d", p, var_id, val);
            JsonObject &cfg = *(p->cfg);
            const char *topic_format = cfg["publish_topic"];
            const char *data_format = cfg["publish_data"];
            std::string topic_str(topic_format);
            std::string data_str(data_format);
            // // we need to have parse function which will parse the topic/data format and do string replacement for vars
            parseStr(topic_str, x, var_id, val);
            parseStr(data_str, x, var_id, val);
            ESP_LOGI(TAG, "%s\n%s", topic_str.c_str(), data_str.c_str());
            //ESP_LOGI(TAG, "%s\n%s", topic_format, data_format);
            
            esp_mqtt_client_publish(p->client, topic_str.c_str(), data_str.c_str(), 0, 0, 0);  // len, qos, retain
            return 0;
        }
};

bool MQTTPlugin::init(JsonObject &params) {
    cfg = &((JsonObject &)params["params"]);

    // if (!(*cfg)["topic_format"]) (*cfg)["topic_format"] = "%s/%s";
    // if (!(*cfg)["data_format"]) (*cfg)["data_format"] = "{\"val\":%d}";
    
    ESP_LOGI(TAG, "connecting mqtt to %s", (*cfg)["uri"].as<char*>());
    mqtt_cfg.uri = (*cfg)["uri"].as<char*>();
    mqtt_cfg.client_id = params["client_id"];
    mqtt_cfg.username = (*cfg)["user"].as<char*>();
    mqtt_cfg.password = (*cfg)["pass"].as<char*>();
    mqtt_cfg.lwt_topic = (*cfg)["lwt_topic"].as<char*>();
    mqtt_cfg.lwt_msg = (*cfg)["lwt_msg"].as<char*>();
    mqtt_cfg.event_handle = mqtt_event_handler;
    mqtt_cfg.user_context = (void *)this;

    client = esp_mqtt_client_init(&mqtt_cfg);
    esp_mqtt_client_start(client);

    MQTT_Notify *notify = new MQTT_Notify(this);
    registerController(notify);

    const char *topic_format = (*cfg)["subscribe_topic"];
    std::string topic_str(topic_format);
    parseSubscribeTopicStr(topic_str, &info);
    ESP_LOGI(TAG, "%s", topic_str.c_str());

    uint8_t cnt = 0;
    while (!connected && cnt < 50) {
        cnt++;
        vTaskDelay( 100 / portTICK_PERIOD_MS);
    }


    subscribe(info.topic, [this](char* topic, char* msg) {
        std::string topic_str(topic);
        std::smatch topic_match;
        if (std::regex_match(topic_str, topic_match, info.re)) {
            for (size_t i = 0; i < topic_match.size(); ++i) {
                printf("%s", topic_match[i].str().c_str());
            }
        }

        StaticJsonBuffer<JSON_OBJECT_SIZE(20)> in_json;
        JsonObject& obj = in_json.parseObject(msg);
        const char *device_field = (*cfg)["subscribe_data_device_id"];
        const char *var_field = (*cfg)["subscribe_data_value_id"];
        const char *value_field = (*cfg)["subscribe_data_value"];
        bool device_as_id = (*cfg)["device_as_id"];
        bool value_as_id = (*cfg)["value_as_id"];

        int8_t device_id = device_as_id ? findDeviceIdByName((char*)obj[device_field].as<char*>()) : obj[device_field];
        if (device_id < 0) return;
        int8_t value_id = value_as_id ? findVarIdByName(device_id, (char*)obj[var_field].as<char*>()) : obj[var_field];
        if (value_id > 0) return;
        uint8_t value = obj[value_field];
        update(device_id, value_id, value);

    });

    return true;
}

void MQTTPlugin::subscribe(char *topic, std::function<void(char*,char*)> handler) {
    registeredTopics[topic] = handler;
    int msg_id = esp_mqtt_client_subscribe(client, topic, 0);
    ESP_LOGI(TAG, "sent subscribe successful, msg_id=%d", msg_id);
}