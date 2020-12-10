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
#include "c004_timers.h"

extern WiFiPlugin *wifi_plugin;
extern esp_err_t soft_timer(std::function<void()> fn, int32_t delay, bool repeat);

class NTPPlugin: public Plugin {
    private:
        bool state;
        time_t current_time;
        Type current_time_t = Type::integer;
    public:
        bool hasTime = false;
        DEFINE_PLUGIN(NTPPlugin);
        void getTime(const char *);
};

#endif