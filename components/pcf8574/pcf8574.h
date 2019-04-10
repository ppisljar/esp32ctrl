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
#include <I2Cdev.h>

#ifdef __cplusplus
extern "C" {
#endif


/**
 * @brief Read GPIO port value
 * @param dev Pointer to I2C device descriptor
 * @param val 8-bit GPIO port value
 * @return `ESP_OK` on success
 */
inline esp_err_t pcf8574_port_read(uint8_t dev, uint8_t *val)
{
    return I2Cdev::read(dev, NULL, 0, val, 1);
}

/**
 * @brief Write value to GPIO port
 * @param dev Pointer to I2C device descriptor
 * @param value GPIO port value
 * @return ESP_OK on success
 */
inline esp_err_t pcf8574_port_write(uint8_t dev, uint8_t value)
{
    return I2Cdev::write(dev, NULL, 0, &value, 1);
}

inline esp_err_t pcf8575_port_read(uint8_t dev, uint16_t *val)
{
    return I2Cdev::read(dev, NULL, 0, (uint8_t*)val, 2);
}

inline esp_err_t pcf8575_port_write(uint8_t dev, uint16_t value)
{
    return I2Cdev::write(dev, NULL, 0, (uint8_t*)&value, 2);
}

#ifdef __cplusplus
}
#endif

#endif /* __PCF8574_H__ */
