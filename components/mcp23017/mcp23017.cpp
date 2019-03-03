/**
 * @file mcp23017.c
 *
 * ESP-IDF driver for I2C 16 bit GPIO expander MCP23017
 *
 * Copyright (C) 2018 Ruslan V. Uss (https://github.com/UncleRus)
 * BSD Licensed as described in the file LICENSE
 */
#include "mcp23017.h"
#include <esp_log.h>

#define I2C_FREQ_HZ 1000000 // Max 1MHz for esp-idf, but device supports up to 1.7Mhz

#define REG_IODIRA   0x00
#define REG_IODIRB   0x01
#define REG_IPOLA    0x02
#define REG_IPOLB    0x03
#define REG_GPINTENA 0x04
#define REG_GPINTENB 0x05
#define REG_DEFVALA  0x06
#define REG_DEFVALB  0x07
#define REG_INTCONA  0x08
#define REG_INTCONB  0x09
#define REG_IOCON    0x0A
#define REG_GPPUA    0x0C
#define REG_GPPUB    0x0D
#define REG_INTFA    0x0E
#define REG_INTFB    0x0F
#define REG_INTCAPA  0x10
#define REG_INTCAPB  0x11
#define REG_GPIOA    0x12
#define REG_GPIOB    0x13
#define REG_OLATA    0x14
#define REG_OLATB    0x15

#define BIT_IOCON_INTPOL 1
#define BIT_IOCON_ODR    2
#define BIT_IOCON_HAEN   3
#define BIT_IOCON_DISSLW 4
#define BIT_IOCON_SEQOP  5
#define BIT_IOCON_MIRROR 6
#define BIT_IOCON_BANK   7

static const char *TAG = "MCP23017";

#define CHECK(x) do { esp_err_t __; if ((__ = x) != ESP_OK) return __; } while (0)
#define CHECK_ARG(VAL) do { if (!(VAL)) return ESP_ERR_INVALID_ARG; } while (0)
#define BV(x) (1 << (x))

esp_err_t mcp23017_get_int_out_mode(uint8_t dev, mcp23017_int_out_mode_t *mode)
{
    CHECK_ARG(mode);

    uint8_t buf;
    CHECK(I2Cdev::readBit(dev, REG_IOCON, BIT_IOCON_ODR, &buf));
    if (buf>0)
    {
        *mode = MCP23017_OPEN_DRAIN;
        return ESP_OK;
    }
    CHECK(I2Cdev::readBit(dev, REG_IOCON, BIT_IOCON_INTPOL, &buf));
    *mode = buf ? MCP23017_ACTIVE_HIGH : MCP23017_ACTIVE_LOW;

    return ESP_OK;
}

esp_err_t mcp23017_set_int_out_mode(uint8_t dev, mcp23017_int_out_mode_t mode)
{
    if (mode == MCP23017_OPEN_DRAIN)
        return I2Cdev::writeBit(dev, REG_IOCON, BIT_IOCON_ODR, true);

    return I2Cdev::writeBit(dev, REG_IOCON, BIT_IOCON_INTPOL, mode == MCP23017_ACTIVE_HIGH);
}

esp_err_t mcp23017_port_get_mode(uint8_t dev, uint16_t *val)
{
    return I2Cdev::readWord(dev, REG_IODIRA, val);
}

esp_err_t mcp23017_port_set_mode(uint8_t dev, uint16_t val)
{
    return I2Cdev::writeWord(dev, REG_IODIRA, val);
}

esp_err_t mcp23017_port_get_pullup(uint8_t dev, uint16_t *val)
{
    return I2Cdev::readWord(dev, REG_GPPUA, val);
}

esp_err_t mcp23017_port_set_pullup(uint8_t dev, uint16_t val)
{
    return I2Cdev::writeWord(dev, REG_GPPUA, val);
}

esp_err_t mcp23017_port_read(uint8_t dev, uint16_t *val)
{
    return I2Cdev::readWord(dev, REG_GPIOA, val);
}

esp_err_t mcp23017_port_write(uint8_t dev, uint16_t val)
{
    return I2Cdev::writeWord(dev, REG_GPIOA, val);
}

esp_err_t mcp23017_get_mode(uint8_t dev, uint8_t pin, mcp23017_gpio_mode_t *mode)
{
    CHECK_ARG(mode);

    uint16_t buf;
    CHECK(I2Cdev::readBitW(dev, REG_IODIRA, pin, &buf));
    *mode = buf>0 ? MCP23017_GPIO_INPUT : MCP23017_GPIO_OUTPUT;

    return ESP_OK;
}

esp_err_t mcp23017_set_mode(uint8_t dev, uint8_t pin, mcp23017_gpio_mode_t mode)
{
    return I2Cdev::writeBitW(dev, REG_IODIRA, pin, mode);
}

esp_err_t mcp23017_get_pullup(uint8_t dev, uint8_t pin, uint16_t *enable)
{
    return I2Cdev::readBitW(dev, REG_GPPUA, pin, enable);
}

esp_err_t mcp23017_set_pullup(uint8_t dev, uint8_t pin, uint16_t enable)
{
    return I2Cdev::writeBitW(dev, REG_GPPUA, pin, enable);
}

esp_err_t mcp23017_get_level(uint8_t dev, uint8_t pin, uint32_t *val)
{
    CHECK_ARG(val);

    uint16_t buf;
    CHECK(I2Cdev::readBitW(dev, REG_GPIOA, pin, &buf));
    *val = buf ? 1 : 0;

    return ESP_OK;
}

esp_err_t mcp23017_set_level(uint8_t dev, uint8_t pin, uint32_t val)
{
    return I2Cdev::writeBitW(dev, REG_GPIOA, pin, val);
}

esp_err_t mcp23017_port_set_interrupt(uint8_t dev, uint16_t mask, mcp23017_gpio_intr_t intr)
{
    CHECK_ARG(dev);

    uint16_t int_en;
    CHECK(I2Cdev::readWord(dev, REG_GPINTENA, &int_en));

    if (intr == MCP23017_INT_DISABLED)
    {
        // disable interrupts
        int_en &= ~mask;
        CHECK(I2Cdev::writeWord(dev, REG_GPINTENA, int_en));

        return ESP_OK;
    }

    uint16_t int_con;
    CHECK(I2Cdev::readWord(dev, REG_INTCONA, &int_con));

    if (intr == MCP23017_INT_ANY_EDGE)
        int_con &= ~mask;
    else
    {
        int_con |= mask;

        uint16_t int_def;
        CHECK(I2Cdev::readWord(dev, REG_DEFVALA, &int_def));
        if (intr == MCP23017_INT_LOW_EDGE)
            int_def |= mask;
        else
            int_def &= ~mask;
        CHECK(I2Cdev::writeWord(dev, REG_DEFVALA, int_def));
    }

    CHECK(I2Cdev::writeWord(dev, REG_INTCONA, int_con));

    // enable interrupts
    int_en |= mask;
    CHECK(I2Cdev::writeWord(dev, REG_GPINTENA, int_en));

    return ESP_OK;
}

esp_err_t mcp23017_set_interrupt(uint8_t dev, uint8_t pin, mcp23017_gpio_intr_t intr)
{
    return mcp23017_port_set_interrupt(dev, BV(pin), intr);
}
