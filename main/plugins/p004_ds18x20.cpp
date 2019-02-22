#include "p004_ds18x20.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

const char *TAG = "DS18x20Plugin";

void DS18x20Plugin::task(void * pvParameters)
{
    DS18x20Plugin* s = (DS18x20Plugin*)pvParameters;
    JsonObject &cfg = *(s->cfg);

    ESP_LOGI(TAG, "main task: %i:%i", (unsigned)s, unsigned(s->cfg));
    for( ;; )
    {
        int interval = cfg["interval"] | 60;
        int gpio = cfg["gpio"] | 255;

        if (gpio != 255) {
            if (ds18x20_measure_and_read_multi((gpio_num_t)gpio, s->addrs, s->sensor_count, s->temperature) == ESP_OK)
                ESP_LOGI(TAG, "Sensors read");
            else
                printf(TAG, "Could not read data from sensor");
        }

        vTaskDelay(interval * 1000 / portTICK_PERIOD_MS);
    }
}

bool DS18x20Plugin::init(JsonObject &params) {
    cfg = &params;
    if (!params.containsKey("gpio")) {
        params.set("gpio", 255);
    }
    if (!params.containsKey("interval")) {
        params.set("interval", 60);
    }

    if (params["gpio"] != 255) {
        sensor_count = ds18x20_scan_devices((gpio_num_t)params["gpio"].as<int>(), addrs, 16);
    }

    xTaskCreatePinnedToCore(this->task, TAG, 4096, this, 5, NULL, 1);
    return true;
}


bool DS18x20Plugin::setConfig(JsonObject &params) {
    if (params.containsKey("gpio")) {
        (*cfg)["gpio"] = params["gpio"];
    }
    if (params.containsKey("interval")) {
        (*cfg)["interval"] = params["interval"];
    }
    return true;
}

bool DS18x20Plugin::getConfig(JsonObject &params) {
    params["interval"] = (*cfg)["interval"];
    params["gpio"] = (*cfg)["gpio"];
    params["type"] = (*cfg)["type"];
    return true;
}

bool DS18x20Plugin::setState(JsonObject &params) {
    return true;
}

bool DS18x20Plugin::getState(JsonObject &params) {
    params["temperature"] = temperature;
    params["addrs"] = addrs;
    return true;
}
