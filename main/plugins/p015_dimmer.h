#ifndef ESP_PLUGIN_015_H
#define ESP_PLUGIN_015_H

#include "plugin_defs.h"

class DimmerPlugin: public Plugin {
    private:
        int interval = 60;
        int gpio1 = 255;
        int gpio2 = 255;
        uint8_t state = 0;
    public:
        DEFINE_PLUGIN(DimmerPlugin);
        void setStatePtr_(uint8_t, uint8_t*, bool);
        static void task(void *pvParameters);
};

#endif