/**
 * @file pcf8574.c
 *
 * ESP-IDF driver for PCF8574 compartible remote 8-bit I/O expanders for I2C-bus
 *
 * Copyright (C) 2018 Ruslan V. Uss (https://github.com/UncleRus)
 * MIT Licensed as described in the file LICENSE
 */
#include "pcf8574.h"
#include <esp_err.h>

#define CHECK(x) do { esp_err_t __; if ((__ = x) != ESP_OK) return __; } while (0)
#define CHECK_ARG(VAL) do { if (!(VAL)) return ESP_ERR_INVALID_ARG; } while (0)

typedef struct {
    i2c_bus_handle_t bus;
    uint16_t dev_addr;
} pcf8574_dev_t;

pcf8574_handle_t pcf8574_create(i2c_bus_handle_t bus, uint16_t dev_addr)
{
    pcf8574_dev_t* device = (pcf8574_dev_t*) calloc(1, sizeof(pcf8574_dev_t));
    device->bus = bus;
    device->dev_addr = dev_addr;
    return (pcf8574_handle_t) device;
}

esp_err_t pcf8574_port_write(pcf8574_handle_t dev, uint8_t data)
{
    esp_err_t ret;
    pcf8574_dev_t* device = (pcf8574_dev_t*) dev;
    i2c_cmd_handle_t cmd = i2c_cmd_link_create();
    i2c_master_start(cmd);
    i2c_master_write_byte(cmd, (device->dev_addr << 1) | WRITE_BIT,
            ACK_CHECK_EN);
    i2c_master_write_byte(cmd, data, ACK_CHECK_EN);
    ret = iot_i2c_bus_cmd_begin(device->bus, cmd, 1000 / portTICK_RATE_MS);
    i2c_cmd_link_delete(cmd);
    return ret;
}

esp_err_t pcf8574_port_read(pcf8574_handle_t dev, uint8_t *data)
{
    //start-device_addr-word_addr-start-device_addr-data-stop; no_ack of end data
    esp_err_t ret;
    pcf8574_dev_t* device = (pcf8574_dev_t*) dev;
    i2c_cmd_handle_t cmd = i2c_cmd_link_create();

    i2c_master_start(cmd);
    i2c_master_write_byte(cmd, (device->dev_addr << 1) | READ_BIT,
            ACK_CHECK_EN);
    i2c_master_read_byte(cmd, data, NACK_VAL);
    i2c_master_stop(cmd);
    ret = iot_i2c_bus_cmd_begin(device->bus, cmd, 1000 / portTICK_RATE_MS);
    i2c_cmd_link_delete(cmd);
    return ret;
}

esp_err_t pcf8575_port_write(pcf8574_handle_t dev, uint16_t data)
{
    esp_err_t ret;
    pcf8574_dev_t* device = (pcf8574_dev_t*) dev;
    i2c_cmd_handle_t cmd = i2c_cmd_link_create();
    i2c_master_start(cmd);
    i2c_master_write_byte(cmd, (device->dev_addr << 1) | WRITE_BIT,
            ACK_CHECK_EN);
    i2c_master_write_byte(cmd, (uint8_t)(data >> 8), ACK_CHECK_EN);
    i2c_master_write_byte(cmd, (uint8_t)data, ACK_CHECK_EN);
    ret = iot_i2c_bus_cmd_begin(device->bus, cmd, 1000 / portTICK_RATE_MS);
    i2c_cmd_link_delete(cmd);
    return ret;
}

esp_err_t pcf8575_port_read(pcf8574_handle_t dev, uint16_t *data)
{
    //start-device_addr-word_addr-start-device_addr-data-stop; no_ack of end data
    esp_err_t ret;
    pcf8574_dev_t* device = (pcf8574_dev_t*) dev;
    i2c_cmd_handle_t cmd = i2c_cmd_link_create();

    i2c_master_start(cmd);
    i2c_master_write_byte(cmd, (device->dev_addr << 1) | READ_BIT,
            ACK_CHECK_EN);
    i2c_master_read_byte(cmd, (uint8_t*)data, NACK_VAL);
    i2c_master_read_byte(cmd, ((uint8_t*)data)+1, NACK_VAL);
    i2c_master_stop(cmd);
    ret = iot_i2c_bus_cmd_begin(device->bus, cmd, 1000 / portTICK_RATE_MS);
    i2c_cmd_link_delete(cmd);
    return ret;
}