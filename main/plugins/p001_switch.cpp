#include "p001_switch.h"

const char *P001_TAG = "SwitchPlugin";

PLUGIN_CONFIG(SwitchPlugin, interval, gpio)
PLUGIN_STATS(SwitchPlugin, state, state)

void SwitchPlugin::task(void * pvParameters)
{
    SwitchPlugin* s = (SwitchPlugin*)pvParameters;
    JsonObject &cfg = *(s->cfg);

    ESP_LOGI(P001_TAG, "main task: %i:%i", (unsigned)s, unsigned(s->cfg));
    for( ;; )
    {
        // Task code goes here.
        int interval = cfg["interval"];
        int gpio = cfg["gpio"];
        ESP_LOGI(P001_TAG, "paramters: interval: %i, gpio: %i", interval, gpio);
        vTaskDelay(interval * 1000 / portTICK_PERIOD_MS);
    }
}

bool SwitchPlugin::init(JsonObject &params) {
    cfg = &params;

    xTaskCreatePinnedToCore(this->task, P001_TAG, 4096, this, 5, NULL, 1);
    return true;
}
