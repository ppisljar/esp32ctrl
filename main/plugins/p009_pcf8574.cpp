#include "p009_pcf8574.h"
#include "c001_i2c.h"

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
        void* dev;
        struct IO_DIGITAL_PINS *pins;
        uint8_t type;
    public:
        PCF8574Plugin_digital_read(void* dev_, uint8_t type_, struct IO_DIGITAL_PINS *pins_) {
            dev = dev_;
            pins = pins_;
            type = type_;
        }
        uint8_t operator()(uint8_t pin) {
            uint16_t val = 0;
            ESP_LOGI(P009_TAG, "reading pin %d with pinStart %d", pin, pins->start);
            if (type == 0) pcf8574_port_read(dev, (uint8_t*)&val);
            else pcf8575_port_read(dev, &val);
            ESP_LOGI(P009_TAG, "current port value: %d", val);
            return (uint8_t)(val >> (pin - pins->start)) & 1;
        }
};

class PCF8574Plugin_digital_write : public IO_digital_write {
    private:
        void* dev;
        struct IO_DIGITAL_PINS *pins;
        uint8_t type;
    public:
        PCF8574Plugin_digital_write(void* dev_, uint8_t type_, struct IO_DIGITAL_PINS *pins_) {
            dev = dev_;
            pins = pins_;
            type = type_;
        }
        uint8_t operator()(uint8_t pin, uint8_t value) {
            uint16_t val = 0;
            ESP_LOGI(P009_TAG, "writting %d to pin %d with type %d", value, pin - pins->start, type);
            if (type == 0) pcf8574_port_read(dev, (uint8_t*)&val);
            else pcf8575_port_read(dev, &val);
            ESP_LOGI(P009_TAG, "current port value: %d", val);
            val = (value != 0) ? (val | (1 << (pin - pins->start))) : (val & ~(1 << (pin - pins->start)));
            ESP_LOGI(P009_TAG, "writing port value: %d", val);
            if (type == 0) pcf8574_port_write(dev, (uint8_t)val);  
            else pcf8575_port_write(dev, val);  
            return ESP_OK;
        }
};

bool PCF8574Plugin::init(JsonObject &params) {
    cfg = &((JsonObject &)params["params"]);
    state_cfg = &((JsonArray &)params["state"]);

    uint8_t pcf8574_addr = (*cfg)["addr"];
    uint8_t type = (*cfg)["type"] | 0;
    ESP_LOGI(P009_TAG, "PCF8574 init on addr %d", pcf8574_addr);
    void *dev = pcf8574_create(i2c_plugin->i2c_bus, pcf8574_addr);
    
    PCF8574Plugin_digital_read *digitalRead = new PCF8574Plugin_digital_read(dev, type, &pins);
    //ESP_LOGI(P009_TAG, "setting digital read %p", digitalRead);
    PCF8574Plugin_digital_write *digitalWrite = new PCF8574Plugin_digital_write(dev, type, &pins);
    pins.set_direction = new PCF8574Plugin_set_direction();
    pins.digital_write = digitalWrite;
    pins.digital_read = digitalRead;
    io.addDigitalPins(type ? 16 : 8, &pins);

    uint16_t val = 0;
    if (type == 0) pcf8574_port_read(dev, (uint8_t*)&val);
    else pcf8575_port_read(dev, &val);
    ESP_LOGI(P009_TAG, "initial port value: %d", val);
    val = 0;
    if (type == 0) pcf8574_port_write(dev, (uint8_t)val);
    else pcf8574_port_write(dev, val);
    val = 0;
    if (type == 0) pcf8574_port_read(dev, (uint8_t*)&val);
    else pcf8575_port_read(dev, &val);
    ESP_LOGI(P009_TAG, "af.boot port value: %d", val);


    return true;
}

PCF8574Plugin::~PCF8574Plugin() {
    
}


// adds pins, this pins can then be used as any other
// plugin config allows us to precisely define what this pins are doing
// - input/output
// - pullups etc

// similar page for core pins 