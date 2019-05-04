#ifndef ESP_PLUGIN_017_H
#define ESP_PLUGIN_017_H

#include "plugin_defs.h"
#include "iot_veml6040.h"

class VEML6040Plugin: public Plugin {
    private:
        int16_t r = 0;
        int16_t g = 0;
        int16_t b = 0;
        int16_t w = 0;
        float l = 0;
        TaskHandle_t task_h;
    public:
        DEFINE_PPLUGIN(VEML6040Plugin, 17);

        void* dev;

        static void task(void *pvParameters);
};

#endif