#ifndef ESP_PLUGIN_001_H
#define ESP_PLUGIN_001_H

#include "plugin_defs.h"
#include  "../lib/any.h"

class SwitchPlugin: public Plugin {
    private:
        int gpio = 255;
        uint8_t state = 0;
        Type state_t = Type::byte;

    public:
        DEFINE_PPLUGIN(SwitchPlugin, 1);

};

#endif