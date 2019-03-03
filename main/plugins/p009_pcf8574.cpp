#include "p009_pcf8574.h"

const char *P009_TAG = "PCF8574Plugin";

PLUGIN_CONFIG(PCF8574Plugin, interval, gpio, type)
PLUGIN_STATS(PCF8574Plugin, value, value)

uint8_t pcf8574_addr = 0;

bool PCF8574Plugin::init(JsonObject &params) {
    cfg = &params;

    pcf8574_addr = (*cfg)["addr"];
    pins.set_direction = (io_set_direction_fn_t*)setDirection;
    pins.digital_write = (io_digital_write_fn_t*)digitalWrite;
    pins.digital_read = (io_digital_read_fn_t*)digitalRead;
    io.addDigitalPins(8, &pins);

    return true;
}

esp_err_t PCF8574Plugin::setDirection(uint8_t pin, uint8_t mode) {
    return ESP_OK;
}

esp_err_t PCF8574Plugin::digitalWrite(uint8_t pin, uint8_t value) {
    uint8_t val;
    pcf8574_port_read(pcf8574_addr, &val);
    val = (value != 0) ? (val | (1 << pin)) : (val & ~(1 << pin));
    return pcf8574_port_write(pcf8574_addr, val);
}

uint8_t PCF8574Plugin::digitalRead(uint8_t pin) {
    uint8_t val;
    pcf8574_port_read(pcf8574_addr, &val);
    return (val >> pin) & 1;
}

// adds pins, this pins can then be used as any other
// plugin config allows us to precisely define what this pins are doing
// - input/output
// - pullups etc

// similar page for core pins 