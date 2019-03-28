#ifndef ESP_PLUGIN_001_H
#define ESP_PLUGIN_001_H

#include "plugin_defs.h"

class SwitchPlugin: public Plugin {
    private:
        int interval = 60;
        int gpio = 255;
        bool state = 0;
    public:
        DEFINE_PLUGIN(SwitchPlugin);
        void setStatePtr_(uint8_t, uint8_t*, bool);
        static void task(void *pvParameters);
};

#endif