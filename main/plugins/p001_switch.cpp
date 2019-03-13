#include "p001_switch.h"

const char *P001_TAG = "SwitchPlugin";

PLUGIN_CONFIG(SwitchPlugin, interval, gpio)

void SwitchPlugin::task(void * pvParameters)
{
    SwitchPlugin* s = (SwitchPlugin*)pvParameters;
    JsonObject &cfg = *(s->cfg);

    ESP_LOGI(P001_TAG, "main task: %i:%i", (unsigned)s, unsigned(s->cfg));
    for( ;; )
    {
        // Task code goes here.
        int interval = cfg["interval"] | 60;
        int gpio = cfg["gpio"] | 255;
        if (gpio != 255) {
            s->state = io.digitalRead((gpio_num_t)gpio);
            ESP_LOGI(P001_TAG, "reading gpio %d: %d", gpio, s->state);
        }
        ESP_LOGI(P001_TAG, "parameters: interval: %i, gpio: %i", interval, gpio);
        vTaskDelay(interval * 1000 / portTICK_PERIOD_MS);
    }
}

bool SwitchPlugin::init(JsonObject &params) {
    cfg = &params;

    ESP_LOGI(P001_TAG, "init gpio:%d interval:%d", params["gpio"].as<int>(), params["interval"].as<int>());

    uint8_t gpio = (*cfg)["gpio"] | 255;
    if (gpio != 255) {
        ESP_LOGI(P001_TAG, "setting gpio %d to OUTPUT", gpio);
        io.setDirection(gpio, GPIO_MODE_INPUT_OUTPUT);
    }

    xTaskCreatePinnedToCore(this->task, P001_TAG, 4096, this, 5, NULL, 1);
    return true;
}

bool SwitchPlugin::getState(JsonObject &params) {
    params["state"] = state;
    return true;
}

bool SwitchPlugin::setState(JsonObject &params) {
    state = params["state"];
    return true;
}

void* SwitchPlugin::getStatePtr(uint8_t val) {
    ESP_LOGI(P001_TAG, "return state ptr %d (%p) [%d]", val, &state, state);
    if (val == 0) return &state;
    return NULL;
}

void SwitchPlugin::setStatePtr(uint8_t n, uint8_t *val) {
    int gpio = (*cfg)["gpio"] | 255;

    if (n == 0) {
        state = *val;
        ESP_LOGI(P001_TAG, "updating state %d (%p) [%d]", n, &state, state);
        if (gpio != 255) {
            io.digitalWrite(gpio, state);
        }
    }
}
