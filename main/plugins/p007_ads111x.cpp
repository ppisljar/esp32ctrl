#include "p007_ads111x.h"

const char *P007_TAG = "ADS111xPlugin";

PLUGIN_CONFIG(ADS111xPlugin, interval, gpio, type)
PLUGIN_STATS(ADS111xPlugin, value, value)

bool ADS111xPlugin::init(JsonObject &params) {
    cfg = &params;

    adc0 = new ADS1115(ADS1115_DEFAULT_ADDRESS);

    int mode = (*cfg)["mode"] | ADS1115_MODE_SINGLESHOT;
    int rate = (*cfg)["rate"] | ADS1115_RATE_8;
    int gain = (*cfg)["gain"] | ADS1115_PGA_6P144;
    // todo: which i2c ?
    // todo: add pins

    if (adc0->testConnection()) {
        ESP_LOGI(P007_TAG, "ADS1115 connection successful");
    } else {
        ESP_LOGI(P007_TAG, "ADS1115 connection failed");
    }

    adc0->initialize();
    adc0->setMode(mode);
    adc0->setRate(rate);
    adc0->setGain(gain);

    return true;
}
