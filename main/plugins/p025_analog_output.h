#ifndef ESP_PLUGIN_025_H
#define ESP_PLUGIN_025_H

#include "plugin_defs.h"
#include "driver/dac.h"
#include "soc/dac_channel.h"

class AnalogOutputPlugin: public Plugin {
    private:
        uint8_t gpio = 0;
        uint8_t output = 0;
        Type output_a_t = Type::byte;
    public:
        DEFINE_PPLUGIN(AnalogOutputPlugin, 25);
};

#endif