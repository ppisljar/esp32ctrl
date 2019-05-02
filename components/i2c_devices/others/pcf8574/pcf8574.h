/**
 * @file pcf8574.h
 *
 * ESP-IDF driver for PCF8574 compartible remote 8-bit I/O expanders for I2C-bus
 *
 * Copyright (C) 2018 Ruslan V. Uss (https://github.com/UncleRus)
 * MIT Licensed as described in the file LICENSE
 */
#ifndef __PCF8574_H__
#define __PCF8574_H__

#include <stddef.h>
#include "driver/i2c.h"
#include "iot_i2c_bus.h"

#ifdef __cplusplus
extern "C" {
#endif

#define WRITE_BIT                       I2C_MASTER_WRITE/*!< I2C master write */
#define READ_BIT                        I2C_MASTER_READ /*!< I2C master read */
#define ACK_CHECK_EN                    0x1             /*!< I2C master will check ack from slave*/
#define ACK_CHECK_DIS                   0x0             /*!< I2C master will not check ack from slave */
#define ACK_VAL                         0x0             /*!< I2C ack value */
#define NACK_VAL                        0x1             /*!< I2C nack value */


typedef void* pcf8574_handle_t;

pcf8574_handle_t pcf8574_create(i2c_bus_handle_t bus, uint16_t dev_addr);
/**
 * @brief Read GPIO port value
 * @param dev Pointer to I2C device descriptor
 * @param val 8-bit GPIO port value
 * @return `ESP_OK` on success
 */
esp_err_t pcf8574_port_read(pcf8574_handle_t dev, uint8_t *val);

/**
 * @brief Write value to GPIO port
 * @param dev Pointer to I2C device descriptor
 * @param value GPIO port value
 * @return ESP_OK on success
 */
esp_err_t pcf8574_port_write(pcf8574_handle_t dev, uint8_t value);

esp_err_t pcf8575_port_read(pcf8574_handle_t dev, uint16_t *val);

esp_err_t pcf8575_port_write(pcf8574_handle_t dev, uint16_t value);

#ifdef __cplusplus
}
#endif

#endif /* __PCF8574_H__ */
