#ifndef ESP_PLUGIN_009_H
#define ESP_PLUGIN_009_H

#include "plugin_defs.h"
#include "pcf8574.h"

class PCF8574Plugin: public Plugin {
    private:
        int value = 0;
        Type value_t = Type::integer;
        struct IO_DIGITAL_PINS pins;
    public:
        DEFINE_PPLUGIN(PCF8574Plugin, 9);
};

#endif