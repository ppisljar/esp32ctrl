#include "p002_dht.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "dht.h"

const char *TAG = "DHTPlugin";

void DHTPlugin::task(void * pvParameters)
{
    DHTPlugin* s = (DHTPlugin*)pvParameters;
    JsonObject &cfg = *(s->cfg);

    ESP_LOGI(TAG, "main task: %i:%i", (unsigned)s, unsigned(s->cfg));
    for( ;; )
    {
        int interval = cfg["interval"] | 60;
        int gpio = cfg["gpio"] | 255;
        int sensor_type = cfg["type"] | 0;

        if (gpio != 255) {
            if (dht_read_data((dht_sensor_type_t)sensor_type, (gpio_num_t)gpio, &(s->humidity), &(s->temperature)) == ESP_OK)
                ESP_LOGI(TAG, "Humidity: %d%% Temp: %dC", s->humidity / 10, s->temperature / 10);
            else
                printf(TAG, "Could not read data from sensor");
        }

        vTaskDelay(interval * 1000 / portTICK_PERIOD_MS);
    }
}

bool DHTPlugin::init(JsonObject &params) {
    cfg = &params;
    if (!params.containsKey("gpio")) {
        params.set("gpio", 255);
    }
    if (!params.containsKey("interval")) {
        params.set("interval", 60);
    }
    if (!params.containsKey("type")) {
        params.set("type", 0);
    }

    xTaskCreatePinnedToCore(this->task, TAG, 4096, this, 5, NULL, 1);
    return true;
}


bool DHTPlugin::setConfig(JsonObject &params) {
    if (params.containsKey("gpio")) {
        (*cfg)["gpio"] = params["gpio"];
    }
    if (params.containsKey("interval")) {
        (*cfg)["interval"] = params["interval"];
    }
    if (params.containsKey("type")) {
        (*cfg)["type"] = params["type"];
    }
    return true;
}

bool DHTPlugin::getConfig(JsonObject &params) {
    params["interval"] = (*cfg)["interval"];
    params["gpio"] = (*cfg)["gpio"];
    params["type"] = (*cfg)["type"];
    return true;
}

bool DHTPlugin::setState(JsonObject &params) {
    return true;
}

bool DHTPlugin::getState(JsonObject &params) {
    params["temperature"] = temperature;
    params["humidity"] = humidity;
    return true;
}
