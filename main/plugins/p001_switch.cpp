#include "p001_switch.h"

const char *P001_TAG = "SwitchPlugin";

PLUGIN_CONFIG(SwitchPlugin, interval, gpio)

bool SwitchPlugin::init(JsonObject &params) {
    cfg = &((JsonObject &)params["params"]);
    state_cfg = &((JsonArray &)params["state"]["values"]);

    gpio = (*cfg)["gpio"] | 255;
    if (gpio != 255) {
        ESP_LOGI(P001_TAG, "setting gpio %d to OUTPUT", gpio);
        io.setDirection(gpio, GPIO_MODE_INPUT_OUTPUT);
    }

    return true;
}

bool SwitchPlugin::getState(JsonObject &params) {
    char *stateName = (char*)(*state_cfg)[0]["name"].as<char*>();
    params[stateName] = state;
    return true;
}

bool SwitchPlugin::setState(JsonObject &params) {
    char *stateName = (char*)(*state_cfg)[0]["name"].as<char*>();
    state = params[stateName];
    return true;
    
}

void* SwitchPlugin::getStateVarPtr(int n, Type *t) { 
    if (n > 0) return nullptr;
    if (t != nullptr) *t = Type::byte;
    return &state; 
} 

void SwitchPlugin::setStateVarPtr_(int n, void *val, Type t, bool shouldNotify) {
    bool invert = (*cfg)["invert"] | false;
    
    uint8_t value;
    convert(&value, Type::byte, val, t);
    if (n == 0 && state != value) {
        SET_STATE(this, state, 0, shouldNotify, value, 1);
        ESP_LOGI(P001_TAG, "updating state %d (%p) [%d] to %d", n, &state, state, value);
        if (gpio != 255) {
            ESP_LOGI(P001_TAG, "writting digital out to %d", state);
            io.digitalWrite(gpio, invert ? !state : state);
        }
    } else if (n != 0) {
        ESP_LOGW(P001_TAG, "invalid state id: %d", n);
    }
}

SwitchPlugin::~SwitchPlugin() {
}
