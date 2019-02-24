#include "p002_dht.h"

const char *P002_TAG = "DHTPlugin";

PLUGIN_CONFIG(DHTPlugin, interval, gpio, type)
PLUGIN_STATS(DHTPlugin, temperature, humidity)

void DHTPlugin::task(void * pvParameters)
{
    DHTPlugin* s = (DHTPlugin*)pvParameters;
    JsonObject &cfg = *(s->cfg);

    ESP_LOGI(P002_TAG, "main task: %i:%i", (unsigned)s, unsigned(s->cfg));
    for( ;; )
    {
        int interval = cfg["interval"] | 60;
        int gpio = cfg["gpio"] | 255;
        int sensor_type = cfg["type"] | 0;

        if (gpio != 255) {
            if (dht_read_data((dht_sensor_type_t)sensor_type, (gpio_num_t)gpio, &(s->humidity), &(s->temperature)) == ESP_OK)
                ESP_LOGI(P002_TAG, "Humidity: %d%% Temp: %dC", s->humidity / 10, s->temperature / 10);
            else
                printf(P002_TAG, "Could not read data from sensor");
        }

        vTaskDelay(interval * 1000 / portTICK_PERIOD_MS);
    }
}

bool DHTPlugin::init(JsonObject &params) {
    cfg = &params;

    xTaskCreatePinnedToCore(this->task, P002_TAG, 4096, this, 5, NULL, 1);
    return true;
}
