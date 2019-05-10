#ifndef ESP_PLUGIN_018_H
#define ESP_PLUGIN_018_H

#include "plugin_defs.h"

class DigitalInputPlugin: public Plugin {
    private:
        int interval = 60;
        int gpio = 255;
        uint8_t state = 0;
        Type state_t = Type::byte;
        TaskHandle_t task_h;
    public:
        DEFINE_PPLUGIN(DigitalInputPlugin, 18);
        void setStatePtr_(uint8_t, uint8_t*, bool);
        static void task(void *pvParameters);
};

#endif