#ifndef ESP_PLUGIN_010_H
#define ESP_PLUGIN_010_H

#include "plugin.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_log.h"
#include "pca9685.h"

class PCA9685Plugin: public Plugin {
    private:
        int value = 0;
        uint8_t addr;
        struct IO_DIGITAL_PINS pins;
    public:
        DEFINE_PLUGIN(PCA9685Plugin);
};

#endif