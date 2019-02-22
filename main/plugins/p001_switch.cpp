#include "p001_switch.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

const char *TAG = "SwitchPlugin";

void SwitchPlugin::task(void * pvParameters)
{
    SwitchPlugin* s = (SwitchPlugin*)pvParameters;
    JsonObject &cfg = *(s->cfg);

    ESP_LOGI(TAG, "main task: %i:%i", (unsigned)s, unsigned(s->cfg));
    for( ;; )
    {
        // Task code goes here.
        int interval = cfg["interval"];
        int gpio = cfg["gpio"];
        ESP_LOGI(TAG, "paramters: interval: %i, gpio: %i", interval, gpio);
        vTaskDelay(interval * 1000 / portTICK_PERIOD_MS);
    }
}

// 1. i think we want to avoid creating private variables to copy configuration state
//    - unless we want to only store it in plugins, which would have config file per plugin

/**
 * 2. state should behave differently: there is no initial state passed in, in init we can initialize it, get state should return the state and set state should allow updating it. memoty is allocated by plugin
 *    a. we pass in self describing object (json) and get out the same ... benefit: we don't need any additional schema
 * 
 * :: req1: plugin handles state
 * :: req2: we can set each variable independently
 */  

bool SwitchPlugin::init(JsonObject &params) {
    cfg = &params;
    if (!params.containsKey("gpio")) {
        params.set("gpio", 255);
    }
    if (!params.containsKey("interval")) {
        params.set("interval", 60);
    }
    ESP_LOGI(TAG, "init %i : interval: %i", unsigned(cfg), (int)params["interval"]);
    xTaskCreatePinnedToCore(this->task, TAG, 4096, this, 5, NULL, 1);
    return true;
}


bool SwitchPlugin::setConfig(JsonObject &params) {
    if (params.containsKey("gpio")) {
        (*cfg)["gpio"] = params["gpio"];
    }
    if (params.containsKey("interval")) {
        (*cfg)["interval"] = params["interval"];
    }
    return true;
}

bool SwitchPlugin::getConfig(JsonObject &params) {
    params["interval"] = (*cfg)["interval"];
    params["gpio"] = (*cfg)["gpio"];
    return true;
}

bool SwitchPlugin::setState(JsonObject &params) {
    if (params.containsKey("state")) {
        state = params["state"];
    }
    return true;
}

bool SwitchPlugin::getState(JsonObject &params) {
    params["state"] = state;
    return true;
}
