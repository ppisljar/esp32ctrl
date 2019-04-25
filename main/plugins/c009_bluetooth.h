#ifndef ESP_PLUGIN_c009_H
#define ESP_PLUGIN_c009_H

#include "plugin_defs.h"
#include "freertos/FreeRTOS.h"
#include "driver/timer.h"
#include "ccronexpr.h"

class BlueToothPlugin: public Plugin {
    
    public:
        uint8_t state;
        DEFINE_PLUGIN(BlueToothPlugin);

        void addCron(unsigned char *expr_string, void* callback);
};

#endif