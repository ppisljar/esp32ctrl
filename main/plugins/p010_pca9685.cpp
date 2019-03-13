#include "p010_pca9685.h"

const char *P010_TAG = "PCA9685Plugin";

PLUGIN_CONFIG(PCA9685Plugin, interval, freq, type)
PLUGIN_STATS(PCA9685Plugin, value, value)

class PCA9685Plugin_analog_write {
    private:
        uint8_t addr;
        struct IO_ANALOG_PINS *pins;
    public:
        PCA9685Plugin_analog_write(uint8_t addr_, struct IO_ANALOG_PINS *pins_) {
            addr = addr_;
            pins = pins_;
        }
        uint8_t operator()(uint8_t pin, uint16_t value) {
            return pca9685_set_pwm_value(addr, pin - pins->start, value);
        }
};

bool PCA9685Plugin::init(JsonObject &params) {
    cfg = &params;

    uint8_t addr = (*cfg)["addr"];
    uint16_t freq = (*cfg)["freq"];

    pca9685_set_pwm_frequency(addr, freq);
    PCA9685Plugin_analog_write *analogWrite = new PCA9685Plugin_analog_write(addr, &pins);
    pins.analog_write = (io_analog_write_fn_t*)analogWrite;
    io.addAnalogPins(16, &pins);

    return true;
}