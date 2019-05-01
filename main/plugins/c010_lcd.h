#ifndef ESP_PLUGIN_c010_H
#define ESP_PLUGIN_c010_H

#include "plugin_defs.h"

#include "iot_lvgl.h"

class LcdPlugin: public Plugin {
    
    public:
        uint8_t state;
        DEFINE_PLUGIN(LcdPlugin);
};

#endif