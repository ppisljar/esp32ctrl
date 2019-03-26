#include "p009_pcf8574.h"

const char *P009_TAG = "PCF8574Plugin";

PLUGIN_CONFIG(PCF8574Plugin, interval, gpio, type)
PLUGIN_STATS(PCF8574Plugin, value, value)

class PCF8574Plugin_set_direction : public IO_set_direction {
    public:
        PCF8574Plugin_set_direction() {};
        uint8_t operator()(uint8_t pin, uint8_t mode) {
            return ESP_OK;
        }
};

class PCF8574Plugin_digital_read : public IO_digital_read {
    private:
        uint8_t addr;
        struct IO_DIGITAL_PINS *pins;
    public:
        PCF8574Plugin_digital_read(uint8_t addr_, struct IO_DIGITAL_PINS *pins_) {
            addr = addr_;
            pins = pins_;
        }
        uint8_t operator()(uint8_t pin) {
            uint8_t val = 0;
            ESP_LOGI(P009_TAG, "reading pin %d on addr %d with pinStart %d", pin, addr, pins->start);
            pcf8574_port_read(addr, &val);
            ESP_LOGI(P009_TAG, "current port value: %d", val);
            return (val >> (pin - pins->start)) & 1;
        }
};

class PCF8574Plugin_digital_write : public IO_digital_write {
    private:
        uint8_t addr;
        struct IO_DIGITAL_PINS *pins;
    public:
        PCF8574Plugin_digital_write(uint8_t addr_, struct IO_DIGITAL_PINS *pins_) {
            addr = addr_;
            pins = pins_;
        }
        uint8_t operator()(uint8_t pin, uint8_t value) {
            uint8_t val = 0;
            ESP_LOGI(P009_TAG, "writting %d to pin %d on addr %d with pinStart %d", value, pin, addr, pins->start);
            pcf8574_port_read(addr, &val);
            ESP_LOGI(P009_TAG, "current port value: %d", val);
            val = (value != 0) ? (val | (1 << (pin - pins->start))) : (val & ~(1 << (pin - pins->start)));
            ESP_LOGI(P009_TAG, "writing port value: %d", val);
            return pcf8574_port_write(addr, val);  
        }
};

bool PCF8574Plugin::init(JsonObject &params) {
    cfg = &((JsonObject &)params["params"]);
    state_cfg = &((JsonArray &)params["state"]);

    uint8_t pcf8574_addr = (*cfg)["addr"];
    ESP_LOGI(P009_TAG, "PCF8574 init on addr %d", pcf8574_addr);
    
    PCF8574Plugin_digital_read *digitalRead = new PCF8574Plugin_digital_read(pcf8574_addr, &pins);
    //ESP_LOGI(P009_TAG, "setting digital read %p", digitalRead);
    PCF8574Plugin_digital_write *digitalWrite = new PCF8574Plugin_digital_write(pcf8574_addr, &pins);
    pins.set_direction = new PCF8574Plugin_set_direction();
    pins.digital_write = digitalWrite;
    pins.digital_read = digitalRead;
    io.addDigitalPins(8, &pins);

    uint8_t val = 0;
    pcf8574_port_read(pcf8574_addr, &val);
    ESP_LOGI(P009_TAG, "initial port value: %d", val);
    val = 0;
    pcf8574_port_write(pcf8574_addr, val);
    val = 0;
    pcf8574_port_read(pcf8574_addr, &val);
    ESP_LOGI(P009_TAG, "af.boot port value: %d", val);


    return true;
}

// adds pins, this pins can then be used as any other
// plugin config allows us to precisely define what this pins are doing
// - input/output
// - pullups etc

// similar page for core pins 