#ifndef ESP_PLUGIN_XXX_H // !!! dont forget to update to your plugin number
#define ESP_PLUGIN_XXX_H

#include "plugin_defs.h"

class TemplatePlugin: public Plugin {
    private:
        uint8_t setting_1 = 60;     // your plugin settings
        bool setting_2 = true;
        uint8_t state_1 = 0;        // your plugin state (variables that are not stored)
        bool state_2 = false;
    public:
        DEFINE_PLUGIN(TemplatePlugin);

        // add any custom methods here
        static void task(void *pvParameters);
};

#endif