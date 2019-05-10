#ifndef ESP_PLUGIN_c007_H
#define ESP_PLUGIN_c007_H

#include "plugin_defs.h"
#include "freertos/FreeRTOS.h"
#include "../lib/rule_engine.h"

class LoggingPlugin: public Plugin {
    
    public:
        FILE *f;
        uint8_t state;
        Type state_t = Type::byte;
        DEFINE_PLUGIN(LoggingPlugin);
};

#endif