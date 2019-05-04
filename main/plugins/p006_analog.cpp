#include "p006_analog.h"

const char *P006_TAG = "AnalogPlugin";

PLUGIN_CONFIG(AnalogPlugin, interval, gpio, type)
PLUGIN_STATS(AnalogPlugin, value, value)

void AnalogPlugin::task(void * pvParameters)
{
    AnalogPlugin* s = (AnalogPlugin*)pvParameters;
    JsonObject &cfg = *(s->cfg);

    ESP_LOGI(P006_TAG, "main task: %i:%i", (unsigned)s, unsigned(s->cfg));
    for( ;; )
    {
        int interval = cfg["interval"] | 60;
        int gpio = cfg["gpio"] | 255;
        if (interval == 0) interval = 60;

        if (gpio != 255) {
            SET_STATE(s, value, 0, true, io.analogRead(gpio), 2);
        }

        vTaskDelay(interval * 1000 / portTICK_PERIOD_MS);
    }
}

// TODO: update to use analog ios
bool AnalogPlugin::init(JsonObject &params) {
    cfg = &((JsonObject &)params["params"]);
    state_cfg = &((JsonArray &)params["state"]);

    int gpio = (*cfg)["gpio"] | 255;
    int atten = (*cfg)["type"] | 0;
    // if (adc1_config_width(ADC_WIDTH_BIT_12) != ESP_OK) {
    //     ESP_LOGE(P006_TAG, "error initializing adc");
    //     return false;
    // }
    if (gpio != 255) {
        // todo: we need init on IO pins (setDirection for digital, something for analog)
        // io.init(gpio, options);
        if (adc1_config_channel_atten((adc1_channel_t)gpio, (adc_atten_t)atten) != ESP_OK) {
            ESP_LOGE(P006_TAG, "error initializing adc");
            return false;
        }
        xTaskCreatePinnedToCore(this->task, P006_TAG, 4096, this, 5, &task_h, 1);
    }

    return true;
}

AnalogPlugin::~AnalogPlugin() {
    vTaskDelete(task_h);
}
