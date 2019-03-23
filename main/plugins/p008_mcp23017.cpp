#include "p008_mcp23017.h"

const char *P008_TAG = "MCP23017Plugin";

PLUGIN_CONFIG(MCP23017Plugin, interval, gpio, type)
PLUGIN_STATS(MCP23017Plugin, value, value)

uint8_t mcp23017_addr = 0;

class MCP23017Plugin_set_direction : public IO_set_direction {
    private:
        uint8_t addr;
        struct IO_DIGITAL_PINS *pins;
    public:
        MCP23017Plugin_set_direction(uint8_t addr_, struct IO_DIGITAL_PINS *pins_) {
            addr = addr_;
            pins = pins_;
        }
        uint8_t operator()(uint8_t pin, uint8_t mode) {
            return mcp23017_set_mode(addr, pin - pins->start, (mcp23017_gpio_mode_t)mode);
        }
};

class MCP23017Plugin_digital_read : public IO_digital_read {
    private:
        uint8_t addr;
        struct IO_DIGITAL_PINS *pins;
    public:
        MCP23017Plugin_digital_read(uint8_t addr_, struct IO_DIGITAL_PINS *pins_) {
            addr = addr_;
            pins = pins_;
        }
        uint8_t operator()(uint8_t pin) {
            uint32_t level;
            mcp23017_get_level(mcp23017_addr, pin - pins->start, &level);
            return (uint8_t)level;
        }
};

class MCP23017Plugin_digital_write : public IO_digital_write {
    private:
        uint8_t addr;
        struct IO_DIGITAL_PINS *pins;
    public:
        MCP23017Plugin_digital_write(uint8_t addr_, struct IO_DIGITAL_PINS *pins_) {
            addr = addr_;
            pins = pins_;
        }
        uint8_t operator()(uint8_t pin, uint8_t value) {
            return mcp23017_set_level(mcp23017_addr, pin - pins->start, value);
        }
};

bool MCP23017Plugin::init(JsonObject &params) {
    cfg = &((JsonObject &)params["params"]);

    uint8_t mcp23017_addr = (*cfg)["addr"];
    MCP23017Plugin_digital_read *digitalRead = new MCP23017Plugin_digital_read(mcp23017_addr, &pins);
    MCP23017Plugin_digital_write *digitalWrite = new MCP23017Plugin_digital_write(mcp23017_addr, &pins);
    MCP23017Plugin_set_direction *setDirection = new MCP23017Plugin_set_direction(mcp23017_addr, &pins);
    pins.set_direction = setDirection;
    pins.digital_write = digitalWrite;
    pins.digital_read = digitalRead;
    io.addDigitalPins(16, &pins);

    return true;
}