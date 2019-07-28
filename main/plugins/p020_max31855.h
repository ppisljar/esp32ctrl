#ifndef ESP_PLUGIN_020_H
#define ESP_PLUGIN_020_H

#include "plugin_defs.h"

class Max31855Plugin: public Plugin {
    private:
        float temp = 0;
        int16_t tempRJ = 0;
        int16_t tempTherm = 0;
        float temperature;
        Type temperature_t = Type::decimal;
        // Type temp_t = Type::integer;
        // Type tempRJ_t = Type::integer;
        // Type tempTherm_t = Type::integer;

        void getData(void);
        uint8_t clk;
        uint8_t cs;
        uint8_t data;
        int type;
        TaskHandle_t task_h;
    public:
        DEFINE_PPLUGIN(Max31855Plugin, 20);
        static void task(void *pvParameters);
        te_expr *temp_expr;
};

#endif