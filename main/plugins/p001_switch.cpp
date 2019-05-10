#include "p001_switch.h"

const char *P001_TAG = "SwitchPlugin";

PLUGIN_CONFIG(SwitchPlugin, interval, gpio)
PLUGIN_STATS(SwitchPlugin, state, state);

bool SwitchPlugin::init(JsonObject &params) {
    cfg = &((JsonObject &)params["params"]);
    state_cfg = &((JsonArray &)params["state"]["values"]);

    uint8_t gpio = (*cfg)["gpio"] | 255;
    if (gpio != 255) {
        ESP_LOGI(P001_TAG, "setting gpio %d to OUTPUT", gpio);
        io.setDirection(gpio, GPIO_MODE_INPUT_OUTPUT);
    }

    

    return true;
}

void SwitchPlugin::setStatePtr_(uint8_t n, uint8_t *val, bool shouldNotify) {
    int gpio = (*cfg)["gpio"] | 255;
    bool invert = (*cfg)["invert"] | false;
    
    if (n == 0 && state != *val) {
        SET_STATE(this, state, 0, shouldNotify, *val, 1);
        ESP_LOGI(P001_TAG, "updating state %d (%p) [%d] to %d", n, &state, state, *val);
        if (gpio != 255) {
            ESP_LOGI(P001_TAG, "writting digital out to %d", state);
            io.digitalWrite(gpio, invert ? !state : state);
        }
    } else if (n != 0) {
        ESP_LOGW(P001_TAG, "invalid state id: %d", n);
    }
}

// all numbers double ? state could also be a string or a byte array
// integer, decimal, bytes
// 
// convert(T* val, Type out) {
//    if (to == number) { if (from == string) str_to_num(); else return *val; }
//    if (to == string) { if (from == string) strncpy(); else num_to_str(); }
// }

// template <typename T>
// setStatePtr(uint n, T* val, Type t) {
//     if (n == 0) state = convert<int32_t>(val, t); // should work for numbers
// }

// cdiggins::any SwitchPlugin::getStateVal(uint8_t n) {
//     if (n == 0) return state;
//     return nullptr;
// }

// void SwitchPlugin::setStateVal(uint8_t n, cdiggins::any val) {
//     if (n == 0) state = val ;
// }

SwitchPlugin::~SwitchPlugin() {
}
