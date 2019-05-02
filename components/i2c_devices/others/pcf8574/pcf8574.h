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


/**
 * @brief Read GPIO port value
 * @param dev Pointer to I2C device descriptor
 * @param val 8-bit GPIO port value
 * @return `ESP_OK` on success
 */
esp_err_t pcf8574_port_read(void* dev, uint8_t *val);

/**
 * @brief Write value to GPIO port
 * @param dev Pointer to I2C device descriptor
 * @param value GPIO port value
 * @return ESP_OK on success
 */
esp_err_t pcf8574_port_write(void* dev, uint8_t value);

esp_err_t pcf8575_port_read(void* dev, uint16_t *val);

esp_err_t pcf8575_port_write(void* dev, uint16_t value);

#ifdef __cplusplus
}
#endif

#endif /* __PCF8574_H__ */
