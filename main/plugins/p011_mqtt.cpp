#include "p011_mqtt.h"

static const char *TAG = "MQTTPlugin";

PLUGIN_CONFIG(MQTTPlugin, interval, uri, client_id, user, pass, lwt_topic, lwt_msg)
PLUGIN_STATS(MQTTPlugin, value, value)

// parses topic and ges out the atual subscribe topic (with wildcards)
static void parseSubscribeTopicStr(const char *topic_in, struct subscribe_info *info) {
    std::string str_topic(topic_in);

    replace_string_in_place(str_topic, "%unit_id%", "test");
    replace_string_in_place(str_topic, "%unit_name%", "test");
    replace_string_in_place(str_topic, "%timestamp%", "test");

    std::string topic(str_topic);

    replace_string_in_place(topic, "%device_id%", "+");
    replace_string_in_place(topic, "%device_name%", "+");
    replace_string_in_place(topic, "%value_id%", "+");
    replace_string_in_place(topic, "%value_name%", "+");
    replace_string_in_place(topic, "%idx%", "+");
    replace_string_in_place(topic, "%value%", "+");

    
    strcpy(info->topic, topic.c_str());  
    ESP_LOGI(TAG, "parsed topic: %s", info->topic);

    uint8_t a = 0; uint8_t b = 0; char* len = 0; uint8_t i = 0;
    auto str_char = str_topic.c_str();
    char temp[24];
    while (a < strlen(str_char)) {
        if (str_char[a] == info->topic[b]) {
            ESP_LOGD(TAG, "equal %c a=%d, b=%d", str_char[a], a, b);
            a++; b++;
        } else {
            if (str_char[a] != '%' || info->topic[b] != '+') {
                ESP_LOGD(TAG, "something went wrong 1");
            }
            ESP_LOGD(TAG, "difference");
            len = (char*)memchr(str_char + a + 1, '/', strlen(str_char) - a);
            if (len == nullptr) {
                ESP_LOGD(TAG, "end of string");
                len = (char*)(str_char + strlen(str_char));
            }
            ESP_LOGD(TAG, "a: %d, len: %d", a, len - (str_char+a));
            strncpy(temp, str_char + a, len - (str_char + a));
            temp[len - (str_char + a)] = 0;
            a = len - str_char;
            b++;
            ESP_LOGD(TAG, "temp=%s", temp);
            if (strcmp(temp, "%device_id%") == 0 || strcmp(temp, "%device_name%") == 0) {
                info->device_id_group = i++;
            }
            if (strcmp(temp, "%value_id%") == 0 || strcmp(temp, "%value_name%") == 0) {
                info->value_id_group = i++;
            }
        }
    }

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
            // todo: we need to call update method
            // -- parse out data as described in data format    
            //ESP_LOGI(TAG, "handler: %p", p->registeredTopics["update/+/+"]);
            //p->registeredTopics["update/+/+"](event->topic, event->data);   
            p->handler(event->topic, event->topic_len, event->data);
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
        uint8_t operator()(Plugin *x, uint8_t var_id, void *val1, uint8_t val_type) {
            uint8_t val = *(uint8_t*)val1;
            ESP_LOGI(TAG, "sending mqtt notification %p %d %d", p, var_id, val);
            if (!p->connected) {
                ESP_LOGW(TAG, "mqtt not connected, skipping");
                return 0;
            }
            JsonObject &cfg = *(p->cfg);
            const char *topic_format = cfg["publish_topic"];
            const char *data_format = cfg["publish_data"];
            std::string topic_str(topic_format);
            std::string data_str(data_format);
            // // we need to have parse function which will parse the topic/data format and do string replacement for vars
            parseStrForVar(topic_str, x, var_id, val);
            parseStrForVar(data_str, x, var_id, val);
            ESP_LOGI(TAG, "%s\n%s", topic_str.c_str(), data_str.c_str());
            //ESP_LOGI(TAG, "%s\n%s", topic_format, data_format);
            
            esp_mqtt_client_publish(p->client, topic_str.c_str(), data_str.c_str(), 0, 0, 0);  // len, qos, retain
            return 0;
        }
};

bool MQTTPlugin::init(JsonObject &params) {
    cfg = &((JsonObject &)params["params"]);
    state_cfg = &((JsonArray &)params["state"]);
    
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

    parseSubscribeTopicStr((*cfg)["subscribe_topic"].as<char*>(), &info);
    ESP_LOGI(TAG, "%s", info.topic);

    uint8_t cnt = 0;
    while (!connected && cnt < 50) {
        cnt++;
        vTaskDelay( 100 / portTICK_PERIOD_MS);
    }

    int msg_id = esp_mqtt_client_subscribe(client, info.topic, 0);
    ESP_LOGI(TAG, "sent subscribe successful, msg_id=%d", msg_id);
    //subscribe(info.topic, [this]);

    // register rule engine custom command (mqtt publish)
    // 0x55 TOPIC_LEN TOPIC DATA_LEN DATA
    register_command(55, [this](uint8_t* start) {
        uint8_t topic_len = start[1];
        uint8_t* topic = start+2;
        uint8_t data_len = start[topic_len + 2];
        uint8_t* data = topic + topic_len + 1;
        publish((char*)topic, (char*)data);
        return topic_len + data_len + 2;
    });

    return true;
}

void MQTTPlugin::handler(char* topic, int topic_len, char* msg) {
    ESP_LOGD(TAG, "got mqtt controller data");
    const char *device_field = (*cfg)["subscribe_data_device_id"];
    const char *var_field = (*cfg)["subscribe_data_value_id"];
    const char *value_field = (*cfg)["subscribe_data_value"];
    bool device_as_id = (*cfg)["device_as_id"];
    bool value_as_id = (*cfg)["value_as_id"];

    int8_t device_id = -1;
    int8_t value_id = -1;

    uint8_t a = 0; uint8_t b = 0; char* len = 0; uint8_t i = 0;
    char temp[24] = {};
    ESP_LOGD(TAG, "parsing topic");
    while (a < topic_len) {
        if (topic[a] == info.topic[b]) {
            ESP_LOGD(TAG, "equal %c a=%d, b=%d", topic[a], a, b);
            a++; b++;
        } else {
            ESP_LOGD(TAG, "difference");
            if (info.topic[b] != '+') {
                ESP_LOGD(TAG, "something went wrong 1");
            }
            len = (char*)memchr(topic + a + 1, '/', topic_len - a);
            if (len == nullptr) {
                ESP_LOGD(TAG, "end of string");
                len = topic + topic_len;
            }
            ESP_LOGD(TAG, "a: %d, len: %d", a, len - (topic+a));
            strncpy(temp, topic + a, len - (topic + a));
            a = len - topic;
            b++;
            ESP_LOGD(TAG, "temp: %s i: %d dev_id:%d var_id:%d", temp, i, info.device_id_group, info.value_id_group);

            if (i == info.device_id_group) {
                ESP_LOGD(TAG, "got device");
                device_id = device_as_id ? findDeviceIdByName(temp) : atoi(temp);
                if (device_id < 0) {
                    ESP_LOGW(TAG, "invalid device id");
                    return;
                }
            } else if (i == info.value_id_group) {
                ESP_LOGD(TAG, "got value");
                value_id = value_as_id ? findVarIdByName(device_id, temp) : atoi(temp);
                if (value_id < 0) {
                    ESP_LOGW(TAG, "invalid value id");
                    return;
                }
            }
            
            i++;
        }
    }

    ESP_LOGD(TAG, "parsing data");
    StaticJsonBuffer<JSON_OBJECT_SIZE(20)> in_json;
    JsonObject& obj = in_json.parseObject(msg);

    if (device_id < 0) {
        device_id = device_as_id ? findDeviceIdByName((char*)obj[device_field].as<char*>()) : obj[device_field] | -1;
        if (device_id < 0) {
            ESP_LOGW(TAG, "invalid device id");
            return;
        }
    }
    if (value_id < 0) {
        value_id = value_as_id ? findVarIdByName(device_id, (char*)obj[var_field].as<char*>()) : obj[var_field] | -1;
        if (value_id > 0) {
            ESP_LOGW(TAG, "invalid value id");
            return;
        }
    }
    if (!obj.containsKey(value_field)) {
        ESP_LOGW(TAG, "value property not found");
        return;
    }
    const char* value = obj[value_field];

    ESP_LOGD(TAG, "updating device");
    update(device_id, value_id, (void*)value, Type::string);

}

void MQTTPlugin::publish(char *topic, char* data) {
    esp_mqtt_client_publish(client, topic, data, 0, 0, 0);
}

void MQTTPlugin::subscribe(char *topic, std::function<void(char*,char*)> handler) {
    ESP_LOGI(TAG, "regstering topic %s with %p", topic, handler);
    registeredTopics[topic] = handler;
    int msg_id = esp_mqtt_client_subscribe(client, topic, 0);
    ESP_LOGI(TAG, "sent subscribe successful, msg_id=%d", msg_id);
}

MQTTPlugin::~MQTTPlugin() {
    
}
