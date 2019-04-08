#ifndef ESP_PLUGIN_015_H
#define ESP_PLUGIN_015_H

#include "plugin_defs.h"

class MotorPlugin: public Plugin {
    private:
        int interval = 60;
        int gpio1 = 255;
        int gpio2 = 255;
    public:
        DEFINE_PLUGIN(MotorPlugin);
        int max;
        uint8_t state = 0;
        DRV8833 *motor1;
        void setStatePtr_(uint8_t, uint8_t*, bool);
        static void task(void *pvParameters);
};

#endif