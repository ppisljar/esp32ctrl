#ifndef ESP_PLUGIN_021_H
#define ESP_PLUGIN_021_H

#include "plugin_defs.h"

// RAM
#define MLX90614_RAWIR1 0x04
#define MLX90614_RAWIR2 0x05
#define MLX90614_TA 0x06
#define MLX90614_TOBJ1 0x07
#define MLX90614_TOBJ2 0x08
// EEPROM
#define MLX90614_TOMAX 0x20
#define MLX90614_TOMIN 0x21
#define MLX90614_PWMCTRL 0x22
#define MLX90614_TARANGE 0x23
#define MLX90614_EMISS 0x24
#define MLX90614_CONFIG 0x25
#define MLX90614_ADDR 0x0E
#define MLX90614_ID1 0x3C
#define MLX90614_ID2 0x3D
#define MLX90614_ID3 0x3E
#define MLX90614_ID4 0x3F

class Mlx90614Plugin: public Plugin {
    private:
        float temp = 0;
        float tempAmb = 0;
        float temperature;
        Type temperature_t = Type::decimal;
        
        uint16_t read16(uint8_t reg);
        uint8_t crc8 (uint8_t inCrc, uint8_t inData);
        uint8_t addr;
        TaskHandle_t task_h;
    public:
        DEFINE_PPLUGIN(Mlx90614Plugin, 21);
        static void task(void *pvParameters);
        te_expr *temp_expr;
};

#endif