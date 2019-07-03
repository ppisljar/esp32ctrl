/**
 * @file pca9685.c
 *
 * ESP-IDF driver for 16-channel, 12-bit PWM PCA9685
 *
 * Ported from esp-open-rtos
 * Copyright (C) 2016, 2018 Ruslan V. Uss <unclerus@gmail.com>
 * BSD Licensed as described in the file LICENSE
 */
#include "pca9685.h"

#include <esp_system.h>
#include <esp_log.h>

#define REG_MODE1      0x00
#define REG_MODE2      0x01
#define REG_SUBADR1    0x02
#define REG_SUBADR2    0x03
#define REG_SUBADR3    0x04
#define REG_ALLCALLADR 0x05
#define REG_LEDX       0x06
#define REG_ALL_LED    0xfa
#define REG_PRE_SCALE  0xfe

#define MODE1_RESTART (1 << 7)
#define MODE1_EXTCLK  (1 << 6)
#define MODE1_AI      (1 << 5)
#define MODE1_SLEEP   (1 << 4)

#define MODE1_SUB_BIT 3

#define MODE2_INVRT   (1 << 4)
#define MODE2_OUTDRV  (1 << 2)

#define LED_FULL_ON_OFF (1 << 4)

#define REG_LED_N(x)  (REG_LEDX + (x) * 4)
#define OFFS_REG_LED_ON  1
#define OFFS_REG_LED_OFF 3

#define INTERNAL_FREQ 25000000

#define MIN_PRESCALER 0x03
#define MAX_PRESCALER 0xff
#define MAX_SUBADDR   2

#define WAKEUP_DELAY_US 500

#define CHECK_ARG(VAL) do { if (!(VAL)) return ESP_ERR_INVALID_ARG; } while (0)
#define CHECK_ARG_LOGE(VAL, msg, ...) do { if (!(VAL)) { ESP_LOGE(TAG, msg, ## __VA_ARGS__); return ESP_ERR_INVALID_ARG; } } while (0)
#undef ESP_ERROR_CHECK
#define ESP_ERROR_CHECK(x)   do { esp_err_t rc = (x); if (rc != ESP_OK) { ESP_LOGE("err", "esp_err_t = %d", rc); /*assert(0 && #x);*/} } while(0);


static const char *TAG = "PCA9685";

inline static uint32_t round_div(uint32_t x, uint32_t y)
{
    return (x + y / 2) / y;
}

inline static esp_err_t write_reg(uint8_t dev, uint8_t reg, uint8_t val)
{
    return I2Cdev::writeByte(dev, reg, val) ? ESP_OK : ESP_FAIL;
}

inline static esp_err_t read_reg(uint8_t dev, uint8_t reg, uint8_t *val)
{
    return I2Cdev::readByte(dev, reg, val) ? ESP_OK : ESP_FAIL;
}

static esp_err_t update_reg(uint8_t dev, uint8_t reg, uint8_t mask, uint8_t val)
{
    uint8_t v;

    ESP_ERROR_CHECK(read_reg(dev, reg, &v));
    v = (v & ~mask) | val;
    ESP_ERROR_CHECK(write_reg(dev, reg, v));

    return ESP_OK;
}


///////////////////////////////////////////////////////////////////////////////
/// Public

esp_err_t pca9685_init(uint8_t dev)
{
    CHECK_ARG(dev);


    // Enable autoincrement
    ESP_ERROR_CHECK(update_reg(dev, REG_MODE1, MODE1_AI, MODE1_AI));


    return ESP_OK;
}

esp_err_t pca9685_set_subaddr(uint8_t dev, uint8_t num, uint8_t subaddr, bool enable)
{
    CHECK_ARG(dev);
    CHECK_ARG_LOGE(num <= MAX_SUBADDR, "Invalid subadress number (%d), must be in (0..2)", num);


    ESP_ERROR_CHECK(write_reg(dev, REG_SUBADR1 + num, subaddr << 1));

    uint8_t mask = 1 << (MODE1_SUB_BIT - num);
    ESP_ERROR_CHECK(update_reg(dev, REG_MODE1, mask, enable ? mask : 0));


    return ESP_OK;
}

esp_err_t pca9685_restart(uint8_t dev)
{
    CHECK_ARG(dev);


    uint8_t mode;
    ESP_ERROR_CHECK(read_reg(dev, REG_MODE1, &mode));
    if (mode & MODE1_RESTART)
    {
        write_reg(dev, REG_MODE1, mode & ~MODE1_SLEEP);
        ets_delay_us(WAKEUP_DELAY_US);
    }
    ESP_ERROR_CHECK(write_reg(dev, REG_MODE1, (mode & ~MODE1_SLEEP) | MODE1_RESTART));


    return ESP_OK;
}

esp_err_t pca9685_is_sleeping(uint8_t dev, bool *sleeping)
{
    CHECK_ARG(dev);
    CHECK_ARG(sleeping);

    uint8_t v;

    ESP_ERROR_CHECK(read_reg(dev, REG_MODE1, &v));

    *sleeping = v & MODE1_SLEEP;

    return ESP_OK;
}

esp_err_t pca9685_sleep(uint8_t dev, bool sleep)
{
    CHECK_ARG(dev);


    ESP_ERROR_CHECK(update_reg(dev, REG_MODE1, MODE1_SLEEP, sleep ? MODE1_SLEEP : 0));
    if (!sleep)
        ets_delay_us(WAKEUP_DELAY_US);


    return ESP_OK;
}

esp_err_t pca9685_is_output_inverted(uint8_t dev, bool *inv)
{
    CHECK_ARG(dev);
    CHECK_ARG(inv);

    uint8_t v;

    ESP_ERROR_CHECK(read_reg(dev, REG_MODE2, &v));

    *inv = v & MODE2_INVRT;

    return ESP_OK;
}

esp_err_t pca9685_set_output_inverted(uint8_t dev, bool inverted)
{
    CHECK_ARG(dev);


    ESP_ERROR_CHECK(update_reg(dev, REG_MODE2, MODE2_INVRT, inverted ? MODE2_INVRT : 0));


    return ESP_OK;
}

esp_err_t pca9685_get_output_open_drain(uint8_t dev, bool *od)
{
    CHECK_ARG(dev);
    CHECK_ARG(od);

    uint8_t v;

    ESP_ERROR_CHECK(read_reg(dev, REG_MODE2, &v));

    *od = v & MODE2_OUTDRV;

    return ESP_OK;
}

esp_err_t pca9685_set_output_open_drain(uint8_t dev, bool od)
{
    CHECK_ARG(dev);


    ESP_ERROR_CHECK(update_reg(dev, REG_MODE2, MODE2_OUTDRV, od ? 0 : MODE2_OUTDRV));


    return ESP_OK;
}

esp_err_t pca9685_get_prescaler(uint8_t dev, uint8_t *prescaler)
{
    CHECK_ARG(dev);
    CHECK_ARG(prescaler);


    ESP_ERROR_CHECK(read_reg(dev, REG_PRE_SCALE, prescaler));


    return ESP_OK;
}

esp_err_t pca9685_set_prescaler(uint8_t dev, uint8_t prescaler)
{
    CHECK_ARG(dev);
    CHECK_ARG_LOGE(prescaler >= MIN_PRESCALER,
            "Inavlid prescaler value: (%d), must be >= 3", prescaler);

    pca9685_sleep(dev, true);

    ESP_ERROR_CHECK(write_reg(dev, REG_PRE_SCALE, prescaler));

    pca9685_sleep(dev, false);

    return ESP_OK;
}

esp_err_t pca9685_get_pwm_frequency(uint8_t dev, uint16_t *freq)
{
    CHECK_ARG(dev);
    CHECK_ARG(freq);

    uint8_t prescale;

    ESP_ERROR_CHECK(read_reg(dev, REG_PRE_SCALE, &prescale));

    *freq = INTERNAL_FREQ / ((uint32_t)4096 * (prescale + 1));

    return ESP_OK;
}

esp_err_t pca9685_set_pwm_frequency(uint8_t dev, uint16_t freq)
{
    uint32_t prescaler = round_div(INTERNAL_FREQ, (uint32_t)4096 * freq) - 1;
    CHECK_ARG_LOGE(prescaler >= MIN_PRESCALER && prescaler <= MAX_PRESCALER,
            "Inavlid prescaler value (%d), must be in (%d..%d)", prescaler,
            MIN_PRESCALER, MAX_PRESCALER);
    return pca9685_set_prescaler(dev, prescaler);
}

esp_err_t pca9685_set_pwm_value(uint8_t dev, uint8_t channel, uint16_t val)
{
    CHECK_ARG(dev);
    CHECK_ARG_LOGE(channel <= PCA9685_CHANNEL_ALL,
            "Invalid channel %d, must be in (0..%d)", channel, PCA9685_CHANNEL_ALL);
    CHECK_ARG_LOGE(val <= 4096,
            "Invalid PWM value %d, must be in (0..4096)", val);

    uint8_t reg = channel == PCA9685_CHANNEL_ALL ? REG_ALL_LED : REG_LED_N(channel);


    if (val == 0)
    {
        // Full off
        ESP_ERROR_CHECK(write_reg(dev, reg + OFFS_REG_LED_OFF, LED_FULL_ON_OFF));
    }
    else if (val < 4096)
    {
        // Normal
        uint8_t buf[4] = { 0, 0, (uint8_t)val, (uint8_t)(val >> 8) };
        if (!I2Cdev::writeBytes(dev, reg, 4, buf)) {
            ESP_LOGW(TAG, "failed");
            return ESP_FAIL;
        }
    }
    else
    {
        // Full on
        ESP_ERROR_CHECK(write_reg(dev, reg + OFFS_REG_LED_OFF, 0));
        ESP_ERROR_CHECK(write_reg(dev, reg + OFFS_REG_LED_ON, LED_FULL_ON_OFF));
    }


    return ESP_OK;
}

esp_err_t pca9685_set_pwm_values(uint8_t dev, uint8_t first_ch, uint8_t channels, const uint16_t *values)
{
    CHECK_ARG(values);
    CHECK_ARG_LOGE(channels > 0 && first_ch + channels - 1 < PCA9685_CHANNEL_ALL,
            "Invalid first_ch or channels: (%d, %d)", first_ch, channels);

    esp_err_t res;
    for (uint8_t i = 0; i < channels; i ++)
        if ((res = pca9685_set_pwm_value(dev, first_ch + i, values[i])) != ESP_OK)
        {
            ESP_LOGE(TAG, "Could not set channel %d value %d: %d", i, values[i], res);
            return res;
        }

    return ESP_OK;
}
