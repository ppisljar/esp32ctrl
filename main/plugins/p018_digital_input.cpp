#include "p018_digital_input.h"

static const char *TAG = "DigitalInputPlugin";

PLUGIN_CONFIG(DigitalInputPlugin, interval, gpio)
PLUGIN_STATS(DigitalInputPlugin, state, state);

void DigitalInputPlugin::task(void * pvParameters)
{
    DigitalInputPlugin* s = (DigitalInputPlugin*)pvParameters;
    JsonObject &cfg = *(s->cfg);

    for( ;; )
    {
        // Task code goes here.
        int interval = cfg["interval"] | 60;
        int gpio = cfg["gpio"] | 255;
        bool invert = cfg["invert"] | false;

        if (interval == 0) interval = 60;

        if (gpio != 255) {
            uint8_t val = io.digitalRead((gpio_num_t)gpio);
            SET_STATE(s, state, 0, true, invert ? (val > 0 ? 0 : 1) : val, 1);
            ESP_LOGI(TAG, "reading gpio %d: %d", gpio, s->state);
        }
        ESP_LOGI(TAG, "parameters: interval: %i, gpio: %i", interval, gpio);
        vTaskDelay(interval * 1000 / portTICK_PERIOD_MS);
    }
}

bool DigitalInputPlugin::init(JsonObject &params) {
    cfg = &((JsonObject &)params["params"]);
    state_cfg = &((JsonArray &)params["state"]["values"]);

    uint8_t gpio = (*cfg)["gpio"] | 255;
    if (gpio != 255) {
        ESP_LOGI(TAG, "setting gpio %d to INPUT", gpio);
        io.setDirection(gpio, GPIO_MODE_INPUT_OUTPUT);
        xTaskCreatePinnedToCore(this->task, TAG, 4096, this, 5, &task_h, 1);
    }

    return true;
}

DigitalInputPlugin::~DigitalInputPlugin() {
    if (task_h) vTaskDelete(task_h);
}
