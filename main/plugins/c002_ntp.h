#ifndef ESP_PLUGIN_c002_H
#define ESP_PLUGIN_c002_H

#include "plugin.h"
#include "../lib/controller.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_log.h"
#include "lwip/err.h"
#include "lwip/apps/sntp.h"
#include "c003_wifi.h"

extern WiFiPlugin *wifi_plugin;

class NTPPlugin: public Plugin {
    private:
        bool state;
        time_t current_time;
        Type current_time_t = Type::integer;
    public:
        DEFINE_PLUGIN(NTPPlugin);
        void getTime(const char *);
};

#endif