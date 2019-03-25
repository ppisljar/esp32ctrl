#ifndef ESP_PLUGIN_c002_H
    #define ESP_PLUGIN_c002_H

    #include "plugin.h"
    #include "../lib/controller.h"
    #include "freertos/FreeRTOS.h"
    #include "freertos/task.h"
    #include "esp_log.h"
    #include "lwip/err.h"
    #include "lwip/apps/sntp.h"

    class NTPPlugin: public Plugin {
        private:
            bool state;
            time_t current_time;
        public:
            DEFINE_PLUGIN(NTPPlugin);
            void getTime(const char *);
    };

    #endif