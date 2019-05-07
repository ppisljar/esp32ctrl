#ifndef ESP_PLUGIN_c010_H
#define ESP_PLUGIN_c010_H

#ifdef CONFIG_LVGL_GUI_ENABLE

#include "plugin_defs.h"

#include "iot_lvgl.h"

class LcdPlugin: public Plugin {
    
    public:
        uint8_t state;
        DEFINE_PLUGIN(LcdPlugin);
};

#endif

#endif