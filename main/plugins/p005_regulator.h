#ifndef ESP_PLUGIN_005_H
#define ESP_PLUGIN_005_H

#include "plugin.h"
#include "../lib/controller.h"
#include "esp_log.h"

class RegulatorPlugin: public Plugin {
    private:
        bool output = 0;
        StaticJsonBuffer<JSON_OBJECT_SIZE(3)> jb;
    public:
        DEFINE_PLUGIN(RegulatorPlugin);
        static void task(void *pvParameters);
};

#endif