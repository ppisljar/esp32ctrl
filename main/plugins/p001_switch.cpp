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
        bool invert = cfg["invert"] | false;

        if (gpio != 255) {
            uint8_t val = io.digitalRead((gpio_num_t)gpio);
            s->state = invert ? (val > 0 ? 0 : 1) : val; 
            notify(s, 0, s->state);
            ESP_LOGI(P001_TAG, "reading gpio %d: %d", gpio, s->state);
        }
        ESP_LOGI(P001_TAG, "parameters: interval: %i, gpio: %i", interval, gpio);
        vTaskDelay(interval * 1000 / portTICK_PERIOD_MS);
    }
}

bool SwitchPlugin::init(JsonObject &params) {
    cfg = &((JsonObject &)params["params"]);
    state_cfg = &((JsonArray &)params["state"]);

    // if ((*state_cfg)[0] == nullptr) {
    //     JsonObject item = (*state_cfg).createNestedObject();
    //     item["name"] = "Switch";
    //     item["type"] = 0;
    // }

    ESP_LOGI(P001_TAG, "init gpio:%d interval:%d", (*cfg)["gpio"].as<int>(), (*cfg)["interval"].as<int>());

    uint8_t gpio = (*cfg)["gpio"] | 255;
    if (gpio != 255) {
        ESP_LOGI(P001_TAG, "setting gpio %d to OUTPUT", gpio);
        io.setDirection(gpio, GPIO_MODE_INPUT_OUTPUT);
    }

    xTaskCreatePinnedToCore(this->task, P001_TAG, 4096, this, 5, NULL, 1);
    return true;
}

bool SwitchPlugin::getState(JsonObject &params) {
    const char* stateName = (*state_cfg)[0]["name"];
    params[stateName] = state;
    return true;
}

bool SwitchPlugin::setState(JsonObject &params) {
    const char* stateName = (*state_cfg)[0]["name"];
    state = params[stateName];
    return true;
}

void* SwitchPlugin::getStatePtr(uint8_t val) {
    ESP_LOGI(P001_TAG, "return state ptr %d (%p) [%d]", val, &state, state);
    if (val == 0) return &state;
    return NULL;
}

void SwitchPlugin::setStatePtr(uint8_t n, uint8_t *val) {
    int gpio = (*cfg)["gpio"] | 255;
    bool invert = (*cfg)["invert"] | false;
    
    if (n == 0 && state != *val) {
        state = *val;
        notify(this, n, state);
        ESP_LOGI(P001_TAG, "updating state %d (%p) [%d]", n, &state, state);
        if (gpio != 255) {
            io.digitalWrite(gpio, invert ? !state : state);
        }
    }
}
