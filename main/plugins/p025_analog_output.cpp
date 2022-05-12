#include "p025_analog_output.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

extern Plugin* active_plugins[50];

static const char *TAG = "AnalogOutputPlugin";

PLUGIN_CONFIG(AnalogOutputPlugin, gpio, gpio)
// we provide custom implementations of below macro functions
// PLUGIN_STATS(MotorDriverPlugin, output_a, output_b)

bool AnalogOutputPlugin::init(JsonObject &params) {
    cfg = &((JsonObject &)params["params"]);
    state_cfg = &((JsonArray &)params["state"]["values"]);

    output = 0;
    gpio = (*cfg)["gpio"] | 255;

    if (gpio != 255 && (gpio == 25 || gpio == 26)) {
        ESP_LOGI(TAG, "setting motor A gpio: %d to OUTPUT", gpio);
        io.setDirection(gpio, GPIO_MODE_OUTPUT);
        dac_output_enable(gpio == 25 ? DAC_GPIO25_CHANNEL : DAC_GPIO26_CHANNEL);
        dac_output_voltage(gpio == 25 ? DAC_GPIO25_CHANNEL : DAC_GPIO26_CHANNEL, output);
    }

    return true;
}

bool AnalogOutputPlugin::getState(JsonObject &params) {
    char *stateName1 = (char*)(*state_cfg)[0]["name"].as<char*>();
    params[stateName1] = output;
    return true;
}

bool AnalogOutputPlugin::setState(JsonObject &params) {
    char *stateName1 = (char*)(*state_cfg)[0]["name"].as<char*>();
    output = params[stateName1];
    return true;
}

void* AnalogOutputPlugin::getStateVarPtr(int n, Type *t) {
    if (n > 0) return nullptr;
    if (t != nullptr) *t = Type::byte;
    return &output;
} 

void AnalogOutputPlugin::setStateVarPtr_(int n, void *val, Type t, bool shouldNotify) {
    uint8_t value;
    convert(&value, Type::byte, val, t);

    // output: 0 = stop, 1 = forwad, 2 = back
    if (n == 0 && output != value) {
        SET_STATE(this, output, 0, shouldNotify, value, 1);
        ESP_LOGD(TAG, "updating state %d (%p) [%d] to %d", n, &output, output, value);
        if (gpio != 255 && (gpio == 25 || gpio == 26)) {
            ESP_LOGI(TAG, "writting digital out [%d] to %d", gpio, output);
            dac_output_voltage(gpio == 25 ? DAC_GPIO25_CHANNEL : DAC_GPIO26_CHANNEL, output);
        }
    } else if (n != 0) {
        ESP_LOGW(TAG, "invalid state id: %d", n);
    }
}

AnalogOutputPlugin::~AnalogOutputPlugin() {
}
