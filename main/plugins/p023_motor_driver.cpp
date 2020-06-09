#include "p023_motor_driver.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

extern Plugin* active_plugins[50];

static const char *TAG = "MotorDriverPlugin";

PLUGIN_CONFIG(MotorDriverPlugin, gpio_a1, gpio_a2, gpio_b1, gpio_b2)
// we provide custom implementations of below macro functions
// PLUGIN_STATS(MotorDriverPlugin, output_a, output_b)

bool MotorDriverPlugin::init(JsonObject &params) {
    cfg = &((JsonObject &)params["params"]);
    state_cfg = &((JsonArray &)params["state"]["values"]);

    output_a = 0;
    output_b = 0;
    gpio_a1 = (*cfg)["gpio_a1"] | 255;
    gpio_a2 = (*cfg)["gpio_a2"] | 255;
    gpio_b1 = (*cfg)["gpio_b1"] | 255;
    gpio_b2 = (*cfg)["gpio_b2"] | 255;

    if (gpio_a1 != 255 && gpio_a2 != 255) {
        ESP_LOGI(TAG, "setting motor A gpio: %d to OUTPUT", gpio_a1);
        io.setDirection(gpio_a1, GPIO_MODE_OUTPUT);
        io.digitalWrite(gpio_a1, 0);
        io.setDirection(gpio_a2, GPIO_MODE_OUTPUT);
        io.digitalWrite(gpio_a2, 0);
    }

    if (gpio_b1 != 255 && gpio_b2 != 255) {
        ESP_LOGI(TAG, "setting motor B gpio: %d to OUTPUT", gpio_b1);
        io.setDirection(gpio_b1, GPIO_MODE_OUTPUT);
        io.digitalWrite(gpio_b1, 0);
        io.setDirection(gpio_b2, GPIO_MODE_OUTPUT);
        io.digitalWrite(gpio_b2, 0);
    }

    return true;
}

bool MotorDriverPlugin::getState(JsonObject &params) {
    char *stateName1 = (char*)(*state_cfg)[0]["name"].as<char*>();
    ESP_LOGI(TAG, "writting state out  to %d", output_a);
    ESP_LOGI(TAG, "%s", stateName1);
    params[stateName1] = output_a;
    char *stateName2 = (char*)(*state_cfg)[1]["name"].as<char*>();
    ESP_LOGI(TAG, "writting state out [%s] to %d", stateName2, output_b);
    params[stateName2] = output_b;
    return true;
}

bool MotorDriverPlugin::setState(JsonObject &params) {
    char *stateName1 = (char*)(*state_cfg)[0]["name"].as<char*>();
    output_a = params[stateName1];
    char *stateName2 = (char*)(*state_cfg)[1]["name"].as<char*>();
    output_b = params[stateName2];
    return true;
}

void* MotorDriverPlugin::getStateVarPtr(int n, Type *t) { 
    if (n > 1) return nullptr;
    if (t != nullptr) *t = Type::byte;
    return n == 0 ? &output_a : &output_b;
} 

void MotorDriverPlugin::setStateVarPtr_(int n, void *val, Type t, bool shouldNotify) {
    uint8_t value;
    convert(&value, Type::byte, val, t);

    // output: 0 = stop, 1 = forwad, 2 = back
    if (n == 0 && output_a != value) {
        SET_STATE(this, output_a, 0, shouldNotify, value, 1);
        ESP_LOGI(TAG, "updating state %d (%p) [%d] to %d", n, &output_a, output_a, value);
        if (gpio_a1 != 255 && gpio_a2 != 255) {
            ESP_LOGI(TAG, "writting digital out [%d] to %d", gpio_a1, output_a == 1 ? 1 : 0);
            ESP_LOGI(TAG, "writting digital out [%d] to %d", gpio_a2, output_a == 2 ? 1 : 0);
            io.digitalWrite(gpio_a1, output_a == 1 ? 1 : 0);
            io.digitalWrite(gpio_a2, output_a == 2 ? 1 : 0);
        }
    } else if (n == 1 && output_b != value) {
        SET_STATE(this, output_b, 1, shouldNotify, value, 1);
        ESP_LOGI(TAG, "updating state %d (%p) [%d] to %d", n, &output_b, output_b, value);
        if (gpio_b1 != 255 && gpio_b2 != 255) {
            ESP_LOGI(TAG, "writting digital out [%d] to %d", gpio_b1, output_b == 1 ? 1 : 0);
            ESP_LOGI(TAG, "writting digital out [%d] to %d", gpio_b2, output_b == 2 ? 1 : 0);
            io.digitalWrite(gpio_b1, output_b == 1 ? 1 : 0);
            io.digitalWrite(gpio_b2, output_b == 2 ? 1 : 0);
        }
    } else if (n != 0) {
        ESP_LOGW(TAG, "invalid state id: %d", n);
    }
}

MotorDriverPlugin::~MotorDriverPlugin() {
}
