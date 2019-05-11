#include "p004_ds18x20.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

const char *P004_TAG = "DS18x20Plugin";

PLUGIN_CONFIG(DS18x20Plugin, interval, gpio)

void DS18x20Plugin::task(void * pvParameters)
{
    DS18x20Plugin* s = (DS18x20Plugin*)pvParameters;
    JsonObject &cfg = *(s->cfg);

    ESP_LOGI(P004_TAG, "main task: %i:%i", (unsigned)s, unsigned(s->cfg));
    for( ;; )
    {
        int interval = cfg["interval"] | 60;
        int gpio = cfg["gpio"] | 255;

        if (interval == 0) interval = 60;

        if (gpio != 255) {
            if (ds18x20_measure_and_read_multi((gpio_num_t)gpio, s->addrs, s->sensor_count, s->temperature) == ESP_OK) {
                ESP_LOGI(P004_TAG, "Sensors read %f", s->temperature[0]);
                notify(s, 0, s->temperature, 1);
            } else
                ESP_LOGI(P004_TAG, "Could not read data from sensor");
        }

        vTaskDelay(interval * 1000 / portTICK_PERIOD_MS);
    }
}

bool DS18x20Plugin::init(JsonObject &params) {
    cfg = &((JsonObject &)params["params"]);
    state_cfg = &((JsonArray &)params["state"]);

    for (int i = 0; i < 16; i++) temperature_t[i] = Type::decimal;
    if (params["gpio"] != 255) {
        sensor_count = ds18x20_scan_devices((gpio_num_t)(*cfg)["gpio"].as<int>(), addrs, 4);
    }

    xTaskCreatePinnedToCore(this->task, P004_TAG, 4096, this, 5, &task_h, 1);
    return true;
}

bool DS18x20Plugin::getState(JsonObject &params) {
    char *stateName;
    for (int n = 0; n < 16; n++) {
        stateName = (char*)(*state_cfg)[n]["name"].as<char*>();
        params[stateName] = temperature[n];
    }
    return true;
}

bool DS18x20Plugin::setState(JsonObject &params) {
    char *stateName;
    for (int n = 0; n < 16; n++) {
        stateName = (char*)(*state_cfg)[n]["name"].as<char*>();
        temperature[n] = params[stateName];
    }
    return true;
}

void* DS18x20Plugin::getStateVarPtr(int n, Type *t) { 
    if (n > 16) return NULL;    
    if (t != nullptr) *t = temperature_t[n]; 
    return &temperature[n]; 
} 

void DS18x20Plugin::setStateVarPtr_(int n, void* val, Type t, bool shouldNotify) {}

DS18x20Plugin::~DS18x20Plugin() {
    vTaskDelete(task_h);
}
