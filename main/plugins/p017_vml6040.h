#ifndef ESP_PLUGIN_017_H
#define ESP_PLUGIN_017_H

#include "plugin_defs.h"
#include "iot_veml6040.h"

class VEML6040Plugin: public Plugin {
    private:
        int r = 0;
        int g = 0;
        int b = 0;
        int w = 0;
        float l = 0;
        Type r_t = Type::integer;
        Type g_t = Type::integer;
        Type b_t = Type::integer;
        Type w_t = Type::integer;
        Type l_t = Type::decimal;
        TaskHandle_t task_h;
    public:
        DEFINE_PPLUGIN(VEML6040Plugin, 17);

        void* dev;

        static void task(void *pvParameters);
};

#endif