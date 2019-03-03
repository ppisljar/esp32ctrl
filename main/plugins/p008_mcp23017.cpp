#include "p008_mcp23017.h"

const char *P008_TAG = "MCP23017Plugin";

PLUGIN_CONFIG(MCP23017Plugin, interval, gpio, type)
PLUGIN_STATS(MCP23017Plugin, value, value)

uint8_t mcp23017_addr = 0;

bool MCP23017Plugin::init(JsonObject &params) {
    cfg = &params;

    mcp23017_addr = (*cfg)["addr"];
    pins.set_direction = (io_set_direction_fn_t*)setDirection;
    pins.digital_write = (io_digital_write_fn_t*)digitalWrite;
    pins.digital_read = (io_digital_read_fn_t*)digitalRead;
    io.addDigitalPins(16, &pins);

    return true;
}

esp_err_t MCP23017Plugin::setDirection(uint8_t pin, uint8_t mode) {
    return mcp23017_set_mode(mcp23017_addr, pin, (mcp23017_gpio_mode_t)mode);
}

esp_err_t MCP23017Plugin::digitalWrite(uint8_t pin, uint8_t value) {
    return mcp23017_set_level(mcp23017_addr, pin, value);
}

uint8_t MCP23017Plugin::digitalRead(uint8_t pin) {
    uint32_t level;
    mcp23017_get_level(mcp23017_addr, pin, &level);
    return (uint8_t)level;
}

// adds pins, this pins can then be used as any other
// plugin config allows us to precisely define what this pins are doing
// - input/output
// - pullups etc

// similar page for core pins