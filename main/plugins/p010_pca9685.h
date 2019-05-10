#ifndef ESP_PLUGIN_010_H
#define ESP_PLUGIN_010_H

#include "plugin_defs.h"
#include "pca9685.h"

class PCA9685Plugin: public Plugin {
    private:
        int value = 0;
        Type value_t = Type::integer;
        uint8_t addr;
        struct IO_DIGITAL_PINS pins;
    public:
        DEFINE_PPLUGIN(PCA9685Plugin, 10);
};

#endif