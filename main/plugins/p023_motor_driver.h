#ifndef ESP_PLUGIN_023_H
#define ESP_PLUGIN_023_H

#include "plugin_defs.h"

class MotorDriverPlugin: public Plugin {
    private:
        uint8_t gpio_a1 = 0;
        uint8_t gpio_a2 = 0;
        uint8_t gpio_b1 = 0;
        uint8_t gpio_b2 = 0;
        uint8_t output_a = 0;
        Type output_a_t = Type::byte;
        uint8_t output_b = 0;
        Type output_b_t = Type::byte;
    public:
        DEFINE_PPLUGIN(MotorDriverPlugin, 23);
};

#endif