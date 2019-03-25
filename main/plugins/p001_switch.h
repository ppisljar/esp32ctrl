#ifndef ESP_PLUGIN_001_H
#define ESP_PLUGIN_001_H

#include "plugin.h"
#include "../lib/controller.h"

class SwitchPlugin: public Plugin {
    private:
        int interval = 60;
        int gpio = 255;
        bool state = 0;
    public:
        DEFINE_PLUGIN(SwitchPlugin);
        static void task(void *pvParameters);
};

#endif