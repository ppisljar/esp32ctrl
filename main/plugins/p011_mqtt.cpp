#include "p011_mqtt.h"

static const char *TAG = "MQTTPlugin";

PLUGIN_CONFIG(MQTTPlugin, interval, uri, client_id, user, pass, lwt_topic, lwt_msg)
PLUGIN_STATS(MQTTPlugin, value, value)

static esp_err_t mqtt_event_handler(esp_mqtt_event_handle_t event)
{
    esp_mqtt_client_handle_t client = event->client;
    int msg_id;
    // your_context_t *context = event->context;
    switch (event->event_id) {
        case MQTT_EVENT_CONNECTED:
            ESP_LOGI(TAG, "MQTT_EVENT_CONNECTED");
            msg_id = esp_mqtt_client_publish(client, "/topic/qos1", "data_3", 0, 1, 0);
            ESP_LOGI(TAG, "sent publish successful, msg_id=%d", msg_id);

            msg_id = esp_mqtt_client_subscribe(client, "/topic/qos0", 0);
            ESP_LOGI(TAG, "sent subscribe successful, msg_id=%d", msg_id);

            msg_id = esp_mqtt_client_subscribe(client, "/topic/qos1", 1);
            ESP_LOGI(TAG, "sent subscribe successful, msg_id=%d", msg_id);

            msg_id = esp_mqtt_client_unsubscribe(client, "/topic/qos1");
            ESP_LOGI(TAG, "sent unsubscribe successful, msg_id=%d", msg_id);
            break;
        case MQTT_EVENT_DISCONNECTED:
            ESP_LOGI(TAG, "MQTT_EVENT_DISCONNECTED");
            break;

        case MQTT_EVENT_SUBSCRIBED:
            ESP_LOGI(TAG, "MQTT_EVENT_SUBSCRIBED, msg_id=%d", event->msg_id);
            msg_id = esp_mqtt_client_publish(client, "/topic/qos0", "data", 0, 0, 0);
            ESP_LOGI(TAG, "sent publish successful, msg_id=%d", msg_id);
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

bool MQTTPlugin::init(JsonObject &params) {
    cfg = &params;

    uint8_t addr = (*cfg)["addr"];
    uint16_t freq = (*cfg)["freq"];

    esp_mqtt_client_config_t mqtt_cfg;
    ESP_LOGI(TAG, "connecting mqtt to %s", params["uri"].as<char*>());
    mqtt_cfg.uri = "mqtt://192.168.1.100"; //params["uri"].as<char*>();
    //mqtt_cfg.client_id = params["client_id"];
    //mqtt_cfg.username = params["user"].as<char*>();
    //mqtt_cfg.password = params["pass"].as<char*>();
    //mqtt_cfg.lwt_topic = params["lwt_topic"].as<char*>();
    //mqtt_cfg.lwt_msg = params["lwt_msg"].as<char*>();
    mqtt_cfg.event_handle = mqtt_event_handler;
    // mqtt_cfg.user_context = (void *)your_context

    //esp_mqtt_client_handle_t client = esp_mqtt_client_init(&mqtt_cfg);
    //esp_mqtt_client_start(client);

    return true;
}