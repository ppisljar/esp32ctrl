/**
 * @file mcp23017.h
 *
 * ESP-IDF driver for I2C 16 bit GPIO expander MCP23017
 *
 * Copyright (C) 2018 Ruslan V. Uss (https://github.com/UncleRus)
 * BSD Licensed as described in the file LICENSE
 */
#ifndef __MCP23017_H__
#define __MCP23017_H__

#include <stddef.h>
#include <stdbool.h>
#include <I2Cdev.h>

#define MCP23017_I2C_ADDR_BASE 0x20

#ifdef __cplusplus
extern "C" {
#endif

/**
 * GPIO mode
 */
typedef enum
{
    MCP23017_GPIO_OUTPUT = 0,
    MCP23017_GPIO_INPUT
} mcp23017_gpio_mode_t;

/**
 * INTA/INTB pins mode
 */
typedef enum
{
    MCP23017_ACTIVE_LOW = 0, //!< Low level on interrupt
    MCP23017_ACTIVE_HIGH,    //!< High level on interrupt
    MCP23017_OPEN_DRAIN      //!< Open drain
} mcp23017_int_out_mode_t;

/**
 * Interrupt mode
 */
typedef enum
{
    MCP23017_INT_DISABLED = 0, //!< No interrupt
    MCP23017_INT_LOW_EDGE,     //!< Interrupt on low edge
    MCP23017_INT_HIGH_EDGE,    //!< Interrupt on high edge
    MCP23017_INT_ANY_EDGE      //!< Interrupt on any edge
} mcp23017_gpio_intr_t;


/**
 * Get INTA/INTB pins mode
 * @param dev Pointer to I2C device descriptor
 * @param[out] mode Buffer to store mode
 * @return `ESP_OK` on success
 */
esp_err_t mcp23017_get_int_out_mode(uint8_t dev, mcp23017_int_out_mode_t *mode);

/**
 * Set INTA/INTB pins mode
 * @param dev Pointer to I2C device descriptor
 * @param mode INTA/INTB pins mode
 * @return `ESP_OK` on success
 */
esp_err_t mcp23017_set_int_out_mode(uint8_t dev, mcp23017_int_out_mode_t mode);

/**
 * @brief Get GPIO pins mode
 * 0 - output, 1 - input for each bit in `val`
 * @param dev Pointer to I2C device descriptor
 * @param[out] val Buffer to store mode, 0 bit for PORTA/GPIO0..15 bit for PORTB/GPIO7
 * @return
 */
esp_err_t mcp23017_port_get_mode(uint8_t dev, uint16_t *val);

/**
 * @brief Set GPIO pins mode
 * 0 - output, 1 - input for each bit in `val`
 * @param dev Pointer to I2C device descriptor
 * @param val Mode, 0 bit for PORTA/GPIO0..15 bit for PORTB/GPIO7
 * @return `ESP_OK` on success
 */
esp_err_t mcp23017_port_set_mode(uint8_t dev, uint16_t val);

/**
 * @brief Get GPIO pullups status
 * 0 - pullup disabled, 1 - pullup enabled for each bit in `val`
 * @param dev Pointer to I2C device descriptor
 * @param[out] val Pullup status, 0 bit for PORTA/GPIO0..15 bit for PORTB/GPIO7
 * @return `ESP_OK` on success
 */
esp_err_t mcp23017_port_get_pullup(uint8_t dev, uint16_t *val);

/**
 * @brief Set GPIO pullups status
 * 0 - pullup disabled, 1 - pullup enabled for each bit in `val`
 * @param dev Pointer to I2C device descriptor
 * @param val Pullup status, 0 bit for PORTA/GPIO0..15 bit for PORTB/GPIO7
 * @return `ESP_OK` on success
 */
esp_err_t mcp23017_port_set_pullup(uint8_t dev, uint16_t val);

/**
 * @brief Read GPIO port value
 * @param dev Pointer to I2C device descriptor
 * @param[out] val 16-bit GPIO port value, 0 bit for PORTA/GPIO0..15 bit for PORTB/GPIO7
 * @return `ESP_OK` on success
 */
esp_err_t mcp23017_port_read(uint8_t dev, uint16_t *val);

/**
 * @brief Write value to GPIO port
 * @param dev Pointer to I2C device descriptor
 * @param value GPIO port value, 0 bit for PORTA/GPIO0..15 bit for PORTB/GPIO7
 * @return `ESP_OK` on success
 */
esp_err_t mcp23017_port_write(uint8_t dev, uint16_t val);

/**
 * Get GPIO pin mode
 * @param dev Pointer to I2C device descriptor
 * @param pin Pin number, 0 for PORTA/GPIO0..15 for PORTB/GPIO7
 * @param[out] mode GPIO pin mode
 * @return `ESP_OK` on success
 */
esp_err_t mcp23017_get_mode(uint8_t dev, uint8_t pin, mcp23017_gpio_mode_t *mode);

/**
 * Set GPIO pin mode
 * @param dev Pointer to I2C device descriptor
 * @param pin Pin number, 0 for PORTA/GPIO0..15 for PORTB/GPIO7
 * @param mode GPIO pin mode
 * @return `ESP_OK` on success
 */
esp_err_t mcp23017_set_mode(uint8_t dev, uint8_t pin, mcp23017_gpio_mode_t mode);

/**
 * @brief Get pullup mode of GPIO pin
 * @param dev Pointer to I2C device descriptor
 * @param pin Pin number, 0 for PORTA/GPIO0..15 for PORTB/GPIO7
 * @param[out] enable pullup mode
 * @return `ESP_OK` on success
 */
esp_err_t mcp23017_get_pullup(uint8_t dev, uint8_t pin, bool *enable);

/**
 * @brief Set pullup mode of GPIO pin
 * @param dev Pointer to I2C device descriptor
 * @param pin Pin number, 0 for PORTA/GPIO0..15 for PORTB/GPIO7
 * @param enable `true` to enable pullup
 * @return `ESP_OK` on success
 */
esp_err_t mcp23017_set_pullup(uint8_t dev, uint8_t pin, bool enable);

/**
 * @brief Read GPIO pin level
 * @param dev Pointer to I2C device descriptor
 * @param pin Pin number, 0 for PORTA/GPIO0..15 for PORTB/GPIO7
 * @param[out] val `true` if pin currently in high state
 * @return `ESP_OK` on success
 */
esp_err_t mcp23017_get_level(uint8_t dev, uint8_t pin, uint32_t *val);

/**
 * @brief Set GPIO pin level
 * Pin must be set up as output
 * @param dev Pointer to I2C device descriptor
 * @param pin Pin number, 0 for PORTA/GPIO0..15 for PORTB/GPIO7
 * @param[out] val `true` if pin currently in high state
 * @return `ESP_OK` on success
 */
esp_err_t mcp23017_set_level(uint8_t dev, uint8_t pin, uint32_t val);

/**
 * Setup interrupt for group of GPIO pins
 * @param dev Pointer to I2C device descriptor
 * @param mask Pins to setup
 * @param intr Interrupt mode
 * @return `ESP_OK` on success
 */
esp_err_t mcp23017_port_set_interrupt(uint8_t dev, uint16_t mask, mcp23017_gpio_intr_t intr);

/**
 * Setup interrupt for GPIO pin
 * @param dev Pointer to I2C device descriptor
 * @param pin Pin number, 0 for PORTA/GPIO0..15 for PORTB/GPIO7
 * @param intr Interrupt mode
 * @return `ESP_OK` on success
 */
esp_err_t mcp23017_set_interrupt(uint8_t dev, uint8_t pin, mcp23017_gpio_intr_t intr);


#ifdef __cplusplus
}
#endif

#endif /* __MCP23017_H__ */
