#include "p007_ads111x.h"

const char *P007_TAG = "ADS111xPlugin";

PLUGIN_CONFIG(ADS111xPlugin, interval, gpio, type)
PLUGIN_STATS(ADS111xPlugin, value, value)

class ads1115_analog_read : public IO_analog_read {
    private:
        ADS1115 *adc0;
        IO_DIGITAL_PINS *pins;
    public:
        ads1115_analog_read(ADS1115 *adc, IO_DIGITAL_PINS *p) {
            adc0 = adc;
            pins = p;
        }
        uint16_t operator()(uint8_t pin) {
            ESP_LOGI(P007_TAG, "reading pin %d (%d)", pin, pin - pins->start);
            adc0->setMultiplexer(ADS1115_MUX_P0_NG + pin - pins->start);
            return adc0->getConversion(true);    
        }
};

bool ADS111xPlugin::init(JsonObject &params) {
    cfg = &params;

    int mode = (*cfg)["mode"] | ADS1115_MODE_SINGLESHOT;
    int rate = (*cfg)["rate"] | ADS1115_RATE_8;
    int gain = (*cfg)["gain"] | ADS1115_PGA_6P144;
    int addr = (*cfg)["addr"] | ADS1115_DEFAULT_ADDRESS;
    
    adc0 = new ADS1115(addr);

    // auto analogRead1 = [&](uint8_t pin) {
    //     adc0->setMultiplexer(ADS1115_MUX_P0_NG + pin - pins.start);
    //     return adc0->getConversion(true);   
    // };

    pins.analog_read =  new ads1115_analog_read(adc0, &pins);
    io.addDigitalPins(4, &pins);

    if (adc0->testConnection()) {
        ESP_LOGI(P007_TAG, "ADS1115 connection successful");
    } else {
        ESP_LOGI(P007_TAG, "ADS1115 connection failed");
        return false;
    }

    adc0->initialize();
    adc0->setMode(mode);
    adc0->setRate(rate);
    adc0->setGain(gain);

    return true;
}