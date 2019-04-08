#include "p015_dimmer.h"

const char *P001_TAG = "DimmerPlugin";

PLUGIN_CONFIG(DimmerPlugin, interval, gpio1, gpio2)
PLUGIN_STATS(DimmerPlugin, state, state);

void DimmerPlugin::task(void * pvParameters)
{
    // DimmerPlugin* s = (DimmerPlugin*)pvParameters;
    // JsonObject &cfg = *(s->cfg);

    // ESP_LOGI(P001_TAG, "main task: %i:%i", (unsigned)s, unsigned(s->cfg));
    // for( ;; )
    // {
    //     // Task code goes here.
    //     int interval = cfg["interval"] | 60;
    //     int gpio = cfg["gpio"] | 255;
    //     bool invert = cfg["invert"] | false;

    //     if (interval == 0) interval = 60;

    //     if (gpio != 255) {
    //         uint8_t val = io.digitalRead((gpio_num_t)gpio);
    //         SET_STATE(s, state, 0, true, invert ? (val > 0 ? 0 : 1) : val);
    //         ESP_LOGI(P001_TAG, "reading gpio %d: %d", gpio, s->state);
    //     }
    //     ESP_LOGI(P001_TAG, "parameters: interval: %i, gpio: %i", interval, gpio);
    //     vTaskDelay(interval * 1000 / portTICK_PERIOD_MS);
    // }
}

bool DimmerPlugin::init(JsonObject &params) {
    cfg = &((JsonObject &)params["params"]);
    state_cfg = &((JsonArray &)params["state"]["values"]);

    // gpio1 = (*cfg)["gpio1"] | 255;
    // gpio2 = (*cfg)["gpio2"] | 255;
    // if (gpio1 != 255 && gpio2 != 255) {
    //     ESP_LOGI(P001_TAG, "setting gpio %d to OUTPUT", gpio);
    //     io.setDirection(gpio, GPIO_MODE_INPUT_OUTPUT);

    //     // xTaskCreatePinnedToCore(this->task, P001_TAG, 4096, this, 5, NULL, 1);
    // }

    return true;
}

void DimmerPlugin::setStatePtr_(uint8_t n, uint8_t *val, bool shouldNotify) {
    // bool invert = (*cfg)["invert"] | false;
    
    // if (n == 0 && state != *val) {
    //     SET_STATE(this, state, 0, shouldNotify, *val);
    //     ESP_LOGI(P001_TAG, "updating state %d (%p) [%d]", n, &state, state);
    //     if (gpio != 255) {
    //         io.digitalWrite(gpio, invert ? !state : state);
    //     }
    // } else if (n != 0) {
    //     ESP_LOGW(P001_TAG, "invalid state id: %d", n);
    // }
}
