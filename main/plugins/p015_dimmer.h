#ifndef ESP_PLUGIN_015_H
#define ESP_PLUGIN_015_H

#include "plugin_defs.h"
#include "soc/timer_group_struct.h"
#include "driver/periph_ctrl.h"
#include "driver/timer.h"
#include "driver/gpio.h"

class DimmerPlugin: public Plugin {
    private:
        int interval = 60;
        int gpio_zc = 255;
        uint8_t state[8] = {};
    public:
        DEFINE_PPLUGIN(DimmerPlugin, 15);
};

#endif