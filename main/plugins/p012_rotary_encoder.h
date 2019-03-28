#ifndef ESP_PLUGIN_012_H
#define ESP_PLUGIN_012_H

#include "plugin_defs.h"

class RotaryEncoderPlugin: public Plugin {
    private:
        int value = 0;
        
    public:
        DEFINE_PLUGIN(RotaryEncoderPlugin);

};

#endif