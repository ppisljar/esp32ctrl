#include "p015_dimmer.h"

const char *TAG = "MotorPlugin";

PLUGIN_CONFIG(MotorPlugin, interval, gpio1, gpio2, max)
PLUGIN_STATS(MotorPlugin, state, state);

void MotorPlugin::task(void * pvParameters)
{
    MotorPlugin* s = (MotorPlugin*)pvParameters;

    for( ;; )
    {
        s->motor1.drive(s->state, s->max, 7, false, false);
        vTaskDelay(1 / portTICK_PERIOD_MS);
    }
}

bool MotorPlugin::init(JsonObject &params) {
    cfg = &((JsonObject &)params["params"]);
    state_cfg = &((JsonArray &)params["state"]["values"]);

    gpio1 = (*cfg)["gpio1"] | 255;
    gpio2 = (*cfg)["gpio2"] | 255;
    if (gpio1 != 255 && gpio2 != 255) {
        ESP_LOGI(TAG, "setting gpio %d to OUTPUT", gpio);
        io.setDirection(gpio1, GPIO_MODE_INPUT_OUTPUT);
        io.setDirection(gpio2, GPIO_MODE_INPUT_OUTPUT);
        motor1 = new DRV8833(gpio1, gpio2, 0, 1, 0, 255, 20, false, true); // update channel from channel registry
        xTaskCreatePinnedToCore(this->task, TAG, 4096, this, 5, NULL, 1);
    }
    
    return true;
}

void MotorPlugin::setStatePtr_(uint8_t n, uint8_t *val, bool shouldNotify) {    
    if (n == 0 && state != *val) {
        SET_STATE(this, state, 0, shouldNotify, *val);
    } else if (n != 0) {
        ESP_LOGW(P001_TAG, "invalid state id: %d", n);
    }
}
