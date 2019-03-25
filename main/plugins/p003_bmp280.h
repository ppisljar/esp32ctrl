#ifndef ESP_PLUGIN_003_H
#define ESP_PLUGIN_003_H

#include "plugin.h"
#include "esp_log.h"
#include <bmp280.h>

class BMP280Plugin: public Plugin {
    private:
        float temperature = 0;
        float pressure = 0;
        float humidity = 0;
        int type = 0;
    public:
        DEFINE_PLUGIN(BMP280Plugin);
        static void task(void *pvParameters);
};

#endif