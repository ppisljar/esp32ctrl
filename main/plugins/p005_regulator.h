#ifndef ESP_PLUGIN_005_H
#define ESP_PLUGIN_005_H

#include "plugin_defs.h"

class RegulatorPlugin: public Plugin {
    private:
        bool output = 0;
        StaticJsonBuffer<JSON_OBJECT_SIZE(3)> jb;
    public:
        DEFINE_PPLUGIN(RegulatorPlugin, 5);
        static void task(void *pvParameters);
};

#endif