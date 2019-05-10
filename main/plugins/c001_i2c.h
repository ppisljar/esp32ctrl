#ifndef ESP_PLUGIN_c001_H
#define ESP_PLUGIN_c001_H

#include "plugin.h"
#include "../lib/controller.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_log.h"
#include "iot_i2c_bus.h"
#include "driver/i2c.h"

#define ACK_CHECK_EN 0x1                        /*!< I2C master will check ack from slave*/
#define ACK_CHECK_DIS 0x0                       /*!< I2C master will not check ack from slave */
#define ACK_VAL 0x0                             /*!< I2C ack value */
#define NACK_VAL 0x1                            /*!< I2C nack value */

class I2CPlugin: public Plugin {
    private:
        bool state;
        Type state_t = Type::byte;
    public:
        DEFINE_PLUGIN(I2CPlugin);
        void setStatePtr_(uint8_t n, uint8_t *val, bool notify);
        esp_err_t read(uint8_t addr, uint8_t *data_rd, size_t size);
        esp_err_t write(uint8_t addr, uint8_t *data_wr, size_t size);
        void scan();

        i2c_bus_handle_t i2c_bus;
};

extern I2CPlugin* i2c_plugin;

#endif