#include "p008_mcp23017.h"
#include "c001_i2c.h"

const char *P008_TAG = "MCP23017Plugin";

PLUGIN_CONFIG(MCP23017Plugin, interval, gpio, type)

class MCP23017Plugin_set_direction : public IO_set_direction {
    private:
        void* addr;
        struct IO_DIGITAL_PINS *pins;
    public:
        MCP23017Plugin_set_direction(void* addr_, struct IO_DIGITAL_PINS *pins_) {
            addr = addr_;
            pins = pins_;
        }
        uint8_t operator()(uint8_t pin, uint8_t mode) {
            return iot_mcp23017_set_io_dir(addr, mode, (mcp23017_gpio_t)pin - pins->start);
        }
};

class MCP23017Plugin_digital_read : public IO_digital_read {
    private:
        void* addr;
        struct IO_DIGITAL_PINS *pins;
    public:
        MCP23017Plugin_digital_read(void* addr_, struct IO_DIGITAL_PINS *pins_) {
            addr = addr_;
            pins = pins_;
        }
        uint8_t operator()(uint8_t pin) {
            return iot_mcp23017_read_io(addr, (mcp23017_gpio_t)pin - pins->start);
        }
};

class MCP23017Plugin_digital_write : public IO_digital_write {
    private:
        void* addr;
        struct IO_DIGITAL_PINS *pins;
    public:
        MCP23017Plugin_digital_write(void* addr_, struct IO_DIGITAL_PINS *pins_) {
            addr = addr_;
            pins = pins_;
        }
        uint8_t operator()(uint8_t pin, uint8_t value) {
            return iot_mcp23017_write_io(addr, value, (mcp23017_gpio_t)pin - pins->start);
        }
};

bool MCP23017Plugin::init(JsonObject &params) {
    cfg = &((JsonObject &)params["params"]);
    state_cfg = &((JsonArray &)params["state"]);

    if (i2c_plugin == nullptr || i2c_plugin->i2c_bus == nullptr) {
        ESP_LOGW(P008_TAG, "I2C not started, skipping");
        return false;
    }

    uint8_t mcp23017_addr = (*cfg)["addr"];
    void* dev = iot_mcp23017_create(i2c_plugin->i2c_bus, mcp23017_addr);
    MCP23017Plugin_digital_read *digitalRead = new MCP23017Plugin_digital_read(dev, &pins);
    MCP23017Plugin_digital_write *digitalWrite = new MCP23017Plugin_digital_write(dev, &pins);
    MCP23017Plugin_set_direction *setDirection = new MCP23017Plugin_set_direction(dev, &pins);
    pins.set_direction = setDirection;
    pins.digital_write = digitalWrite;
    pins.digital_read = digitalRead;
    io.addDigitalPins(16, &pins);

    return true;
}

bool MCP23017Plugin::getState(JsonObject &params) {
    return true;
}

bool MCP23017Plugin::setState(JsonObject &params) {
    return true;
}

void* MCP23017Plugin::getStateVarPtr(int n, Type *t) {
    return nullptr;
}

void MCP23017Plugin::setStateVarPtr_(int n, void *val, Type t, bool shouldNotify) {

}

MCP23017Plugin::~MCP23017Plugin() {
    
}
