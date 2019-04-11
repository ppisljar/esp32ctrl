#ifndef ESP_PLUGIN_c008_H
#define ESP_PLUGIN_c008_H

#include "plugin_defs.h"
#include "freertos/FreeRTOS.h"
#include "driver/timer.h"
#include "ccronexpr.h"

class CronPlugin: public Plugin {
    
    public:
        uint8_t state;
        DEFINE_PLUGIN(CronPlugin);

        void addCron(unsigned char *expr_string, void* callback);
};

#endif