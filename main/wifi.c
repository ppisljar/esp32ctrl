#include "esp_wifi.h"
#include "esp_log.h"
#include "esp_event_loop.h"

struct status_struct {
    bool wifi_connected;
};

struct status_struct *status_ptr;

static const char *TAG = "wifi";
/* Wi-Fi event handler */
static esp_err_t event_handler(void *ctx, system_event_t *event)
{
    switch(event->event_id) {
    case SYSTEM_EVENT_STA_START:
        ESP_LOGI(TAG, "SYSTEM_EVENT_STA_START");
        ESP_ERROR_CHECK(esp_wifi_connect());
        break;
    case SYSTEM_EVENT_STA_GOT_IP:
        status_ptr->wifi_connected = true;
        ESP_LOGI(TAG, "SYSTEM_EVENT_STA_GOT_IP");
        ESP_LOGI(TAG, "Got IP: '%s'",
                ip4addr_ntoa(&event->event_info.got_ip.ip_info.ip));
        break;
    case SYSTEM_EVENT_STA_DISCONNECTED:
        status_ptr->wifi_connected = false;
        ESP_LOGI(TAG, "SYSTEM_EVENT_STA_DISCONNECTED");
        ESP_ERROR_CHECK(esp_wifi_connect());
        break;
    default:
        break;
    }
    return ESP_OK;
}



/* Function to initialize Wi-Fi at station */
void initialise_wifi(const char *ssid, const char *pass, struct status_struct *status)
{

    ESP_LOGI(TAG, "starting wifi with %s:%s", ssid, pass);

    status_ptr = status;
    ESP_ERROR_CHECK(esp_event_loop_init(event_handler, NULL));
    

    // try to connect to 'ssid:pass'
    // if it fails try to connect AP2
    // if it fails try to connect to old config
    // if it fails go to AP mode 

    wifi_init_config_t cfg = WIFI_INIT_CONFIG_DEFAULT();
    ESP_ERROR_CHECK(esp_wifi_init(&cfg));
    ESP_ERROR_CHECK(esp_wifi_set_storage(WIFI_STORAGE_RAM));
    wifi_config_t wifi_config = {
        .sta = {
            .ssid = "Teltonika_Router",
            .password = "secpass123",
        },
    };
    ESP_LOGI(TAG, "Setting WiFi configuration SSID %s...", wifi_config.sta.ssid);
    ESP_ERROR_CHECK(esp_wifi_set_mode(WIFI_MODE_STA));
    ESP_ERROR_CHECK(esp_wifi_set_config(ESP_IF_WIFI_STA, &wifi_config));
    ESP_ERROR_CHECK(esp_wifi_start());
}