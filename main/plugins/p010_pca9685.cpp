#include "p010_pca9685.h"
#include "c001_i2c.h"

const char *P010_TAG = "PCA9685Plugin";

PLUGIN_CONFIG(PCA9685Plugin, interval, freq, type)
PLUGIN_STATS(PCA9685Plugin, value, value)

class PCA9685Plugin_analog_write : public IO_analog_write {
    private:
        uint8_t addr;
        struct IO_DIGITAL_PINS *pins;
    public:
        PCA9685Plugin_analog_write(uint8_t addr_, struct IO_DIGITAL_PINS *pins_) {
            addr = addr_;
            pins = pins_;
        }
        uint8_t operator()(uint8_t pin, uint16_t value) {
            return pca9685_set_pwm_value(addr, pin - pins->start, value);
        }
};

bool PCA9685Plugin::init(JsonObject &params) {
    cfg = &((JsonObject &)params["params"]);
    state_cfg = &((JsonArray &)params["state"]);

    if (i2c_plugin == nullptr || i2c_plugin->i2c_bus == nullptr) {
        ESP_LOGW(P010_TAG, "I2C not started, skipping");
        return false;
    }

    uint8_t addr = (*cfg)["addr"];
    uint16_t freq = (*cfg)["freq"] | 500;

    esp_err_t err = pca9685_set_pwm_frequency(addr, freq);
    if (err != ESP_OK) {
        ESP_LOGW(P010_TAG, "init failed");
    }
    PCA9685Plugin_analog_write *analogWrite = new PCA9685Plugin_analog_write(addr, &pins);
    pins.analog_write = analogWrite;
    io.addDigitalPins(16, &pins);

    return true;
}

PCA9685Plugin::~PCA9685Plugin() {
    // remove registered pins ?
    // what happens to devices using them ?

}
