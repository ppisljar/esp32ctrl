#include "c005_hue.h"

static const char *TAG = "HueEmulatorPlugin";

PLUGIN_CONFIG(HueEmulatorPlugin, t1_enabled, t2_enabled, t3_enabled, t4_enabled)
PLUGIN_STATS(HueEmulatorPlugin, state, state)

// todo: registering web handlers doens't work ....
extern HueEmulatorPlugin *hue_plugin;

esp_err_t hueemulator_webhandler(httpd_req_t *req) {
    ESP_LOGI(TAG, "description.xml web handler");
    // auto p = (HueEmulatorPlugin*)req->user_ctx;
    return hue_plugin->alexa->serveDescription(req);
    return ESP_OK;
}

void HueEmulatorPlugin::task(void * pvParameters)
{
    HueEmulatorPlugin* s = (HueEmulatorPlugin*)pvParameters;
    JsonObject &cfg = *(s->cfg);

    ESP_LOGI(TAG, "main task: %i:%i", (unsigned)s, unsigned(s->cfg));
    for( ;; )
    {
        s->alexa->loop();
        vTaskDelay(100 / portTICK_PERIOD_MS);
    }
}

bool HueEmulatorPlugin::init(JsonObject &params) {
    cfg = &((JsonObject &)params);
    state_cfg = &((JsonArray &)params["state"]);  

    // we need to wait for wifi (or make ip readable directly from wifi)
    int retry = 0; int retry_count = 5;
    while(wifi_plugin->status.local_ip == 0) {
        ESP_LOGI(TAG, "Waiting for wifi ... (%d/%d)", retry++, retry_count);
        vTaskDelay(2000 / portTICK_PERIOD_MS);
    }

    //http_quick_register("/description", HTTP_GET, hueemulator_webhandler, nullptr);

    ESP_LOGI(TAG, "init");
    alexa = new Espalexa();
    alexa->begin(wifi_plugin->status.local_ip); // starts the udp server
    

    std::function<esp_err_t(httpd_req_t *req)> fn = [this](httpd_req_t *req) {
        ESP_LOGI(TAG, "alexa API call: %s", req->uri);
        return alexa->handleAlexaApiCall(req);
    };
    http_register_404_handler(fn);

    // register all triggers
    JsonArray &triggers = (*cfg)["triggers"];
    for (auto trigger : triggers){
        std::string name(trigger["name"].as<char*>());
        uint8_t type = trigger["type"] | 0;
        ESP_LOGI(TAG, "adding device %s", name.c_str());
        alexa->addDevice(name, [](void *device, uint8_t val) {
            ESP_LOGI(TAG, "YEY");
        }, (EspalexaDeviceType)type, 0);
    }

    xTaskCreatePinnedToCore(this->task, TAG, 4096, this, 5, NULL, 1);

    return true;
}

