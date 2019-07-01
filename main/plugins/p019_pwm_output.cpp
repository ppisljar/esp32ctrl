#include "p019_pwm_output.h"

static const char *TAG = "PWMOutputPlugin";

PLUGIN_CONFIG(PWMOutputPlugin, gpio, gpio)

bool PWMOutputPlugin::init(JsonObject &params) {
    cfg = &((JsonObject &)params["params"]);
    state_cfg = &((JsonArray &)params["state"]["values"]);

    uint8_t gpio = (*cfg)["gpio"] | 255;
    if (gpio != 255) {
        ESP_LOGI(TAG, "setting gpio %d to OUTPUT", gpio);
        io.setDirection(gpio, GPIO_MODE_INPUT_OUTPUT);
    }

    return true;
}

bool PWMOutputPlugin::getState(JsonObject &params) {
    char *stateName = (char*)(*state_cfg)[0]["name"].as<char*>();
    params[stateName] = state;
    return true;
}

bool PWMOutputPlugin::setState(JsonObject &params) {
    char *stateName = (char*)(*state_cfg)[0]["name"].as<char*>();
    state = params[stateName];
    return true;
    
}

void* PWMOutputPlugin::getStateVarPtr(int n, Type *t) { 
    if (n > 0) return nullptr;
    if (t != nullptr) *t = Type::byte;
    return &state; 
} 

void PWMOutputPlugin::setStateVarPtr_(int n, void *val, Type t, bool shouldNotify) {
    int gpio = (*cfg)["gpio"] | 255;
    
    uint8_t value;
    convert(&value, Type::byte, val, t);
    if (n == 0 && state != value) {
        SET_STATE(this, state, 0, shouldNotify, value, 1);
        ESP_LOGI(TAG, "updating state %d (%p) [%d] to %d", n, &state, state, value);
        if (gpio != 255) {
            ESP_LOGI(TAG, "writting analog out (pwm) to %d", state);
            io.analogWrite(gpio, state);
        }
    } else if (n != 0) {
        ESP_LOGW(TAG, "invalid state id: %d", n);
    }
}

PWMOutputPlugin::~PWMOutputPlugin() {
}
