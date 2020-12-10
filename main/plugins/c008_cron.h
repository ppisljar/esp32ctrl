#ifndef ESP_PLUGIN_c008_H
#define ESP_PLUGIN_c008_H

#include "plugin_defs.h"
#include "freertos/FreeRTOS.h"
#include "driver/timer.h"
#include "ccronexpr.h"
#include "c002_ntp.h"

extern NTPPlugin *ntp_plugin;

class CronPlugin: public Plugin {
    
    public:
        uint8_t state;
        Type state_t = Type::byte;
        DEFINE_PLUGIN(CronPlugin);

        void addCron(unsigned char *expr_string, void* callback);
};

#endif