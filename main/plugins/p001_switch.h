#ifndef ESP_PLUGIN_001_H
#define ESP_PLUGIN_001_H

#include "plugin_defs.h"

class SwitchPlugin: public Plugin {
    private:
        int gpio = 255;
        bool invert = false;
        uint8_t state = 0;
        Type state_t = Type::byte;

    public:
        DEFINE_PPLUGIN(SwitchPlugin, 1);

};

#endif