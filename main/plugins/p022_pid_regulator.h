#ifndef ESP_PLUGIN_022_H
#define ESP_PLUGIN_022_H

#include "plugin_defs.h"
#include "MiniPID.h"

class PIDRegulatorPlugin: public Plugin {
    private:
        uint8_t output = 0;
        Type output_t = Type::byte;
        MiniPID *pid;

        StaticJsonBuffer<JSON_OBJECT_SIZE(3)> jb;
        TaskHandle_t task_h;
    public:
        DEFINE_PPLUGIN(PIDRegulatorPlugin, 22);
        static void task(void *pvParameters);
};

#endif