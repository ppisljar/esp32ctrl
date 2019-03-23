#include "p005_regulator.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

extern Plugin* active_plugins[10];

const char *P005_TAG = "RegulatorPlugin";

PLUGIN_CONFIG(RegulatorPlugin, interval, device, value, level, hysteresis)
PLUGIN_STATS(RegulatorPlugin, output, output)

void RegulatorPlugin::task(void * pvParameters)
{
    RegulatorPlugin* s = (RegulatorPlugin*)pvParameters;
    JsonObject &cfg = *(s->cfg);

    ESP_LOGI(P005_TAG, "main task: %i:%i", (unsigned)s, unsigned(s->cfg));
    for( ;; )
    {
        int interval = cfg["interval"] | 60;
        int device = cfg["device"] | 255;
        float level = cfg["level"] | 0;
        float hysteresis = cfg["hysteresis"] | 0;

        if (device != 255) {
            // get the device, request its stats and get the value
            JsonObject& state = (s->jb).createObject();
            active_plugins[device]->getState(state);
            float currentValue = state[cfg["value"].as<char*>()];

            s->output = currentValue > (level + hysteresis);
            ESP_LOGI(P005_TAG, "current output %i", s->output);
        }

        vTaskDelay(interval * 1000 / portTICK_PERIOD_MS);
    }
}

bool RegulatorPlugin::init(JsonObject &params) {
    cfg = &((JsonObject &)params["params"]);

    xTaskCreatePinnedToCore(this->task, P005_TAG, 4096, this, 5, NULL, 1);
    return true;
}