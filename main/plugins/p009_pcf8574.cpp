#include "p009_pcf8574.h"

const char *P009_TAG = "PCF8574Plugin";

PLUGIN_CONFIG(PCF8574Plugin, interval, gpio, type)
PLUGIN_STATS(PCF8574Plugin, value, value)

uint8_t pcf8574_set_direction_fn(uint8_t) {
    return ESP_OK;
}

class PCF8574Plugin_digital_read {
    private:
        uint8_t addr;
        struct IO_DIGITAL_PINS *pins;
    public:
        PCF8574Plugin_digital_read(uint8_t addr_, struct IO_DIGITAL_PINS *pins_) {
            addr = addr_;
            pins = pins_;
        }
        uint8_t operator()(uint8_t pin) {
            uint8_t val;
            pcf8574_port_read(addr, &val);
            return (val >> (pin - pins->start)) & 1;
        }
};

class PCF8574Plugin_digital_write {
    private:
        uint8_t addr;
        struct IO_DIGITAL_PINS *pins;
    public:
        PCF8574Plugin_digital_write(uint8_t addr_, struct IO_DIGITAL_PINS *pins_) {
            addr = addr_;
            pins = pins_;
        }
        uint8_t operator()(uint8_t pin, uint8_t value) {
            uint8_t val;
            pcf8574_port_read(addr, &val);
            val = (value != 0) ? (val | (1 << (pin - pins->start))) : (val & ~(1 << (pin - pins->start)));
            return pcf8574_port_write(addr, val);  
        }
};

bool PCF8574Plugin::init(JsonObject &params) {
    cfg = &params;

    uint8_t pcf8574_addr = (*cfg)["addr"];
    PCF8574Plugin_digital_read *digitalRead = new PCF8574Plugin_digital_read(pcf8574_addr, &pins);
    PCF8574Plugin_digital_write *digitalWrite = new PCF8574Plugin_digital_write(pcf8574_addr, &pins);
    pins.set_direction = (io_set_direction_fn_t*)pcf8574_set_direction_fn;
    pins.digital_write = (io_digital_write_fn_t*)digitalWrite;
    pins.digital_read = (io_digital_read_fn_t*)digitalRead;
    io.addDigitalPins(8, &pins);

    return true;
}

// adds pins, this pins can then be used as any other
// plugin config allows us to precisely define what this pins are doing
// - input/output
// - pullups etc

// similar page for core pins 