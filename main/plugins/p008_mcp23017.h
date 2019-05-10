#ifndef ESP_PLUGIN_008_H
#define ESP_PLUGIN_008_H

#include "plugin_defs.h"
#include "iot_mcp23017.h"

class MCP23017Plugin: public Plugin {
    private:
        int value = 0;
        Type value_t = Type::integer;
        uint8_t addr;
        struct IO_DIGITAL_PINS pins;
    public:
        DEFINE_PPLUGIN(MCP23017Plugin, 8);
};

#endif