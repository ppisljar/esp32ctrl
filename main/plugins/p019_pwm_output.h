#ifndef ESP_PLUGIN_019_H
#define ESP_PLUGIN_019_H

#include "plugin_defs.h"

class PWMOutputPlugin: public Plugin {
    private:
        int gpio = 255;
        uint16_t state = 0;
        Type state_t = Type::integer;

    public:
        DEFINE_PPLUGIN(PWMOutputPlugin, 19);

};

#endif