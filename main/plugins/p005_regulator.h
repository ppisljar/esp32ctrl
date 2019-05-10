#ifndef ESP_PLUGIN_005_H
#define ESP_PLUGIN_005_H

#include "plugin_defs.h"

class RegulatorPlugin: public Plugin {
    private:
        uint8_t output = 0;
        Type output_t = Type::byte;
        
        StaticJsonBuffer<JSON_OBJECT_SIZE(3)> jb;
        TaskHandle_t task_h;
    public:
        DEFINE_PPLUGIN(RegulatorPlugin, 5);
        static void task(void *pvParameters);
};

#endif