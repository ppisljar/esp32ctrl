#include "p003_bmp280.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include <bmp280.h>

const char *TAG = "BMP280Plugin";

void BMP280Plugin::task(void * pvParameters)
{
    BMP280Plugin* s = (BMP280Plugin*)pvParameters;
    JsonObject &cfg = *(s->cfg);

    ESP_LOGI(TAG, "main task: %i:%i", (unsigned)s, unsigned(s->cfg));
    for( ;; )
    {
        int interval = cfg["interval"] | 60;

//        if (cfg["i2c"] != 255) {
//            if (bmp280_read_float(&i2c, &temperature, &pressure, &humidity) != ESP_OK)
//                ESP_LOGI(TAG, "Pressure: %.2f Pa, Temperature: %.2f C", pressure, temperature);
//            else
//                printf(TAG, "Could not read data from sensor");
//            }
//        }

        vTaskDelay(interval * 1000 / portTICK_PERIOD_MS);
    }
}

bool BMP280Plugin::init(JsonObject &params) {
    cfg = &params;
    if (!params.containsKey("gpio")) {
        params.set("i2c", 255);
    }
    if (!params.containsKey("interval")) {
        params.set("interval", 60);
    }
    if (!params.containsKey("type")) {
        params.set("type", 0);
    }

//    if (params["i2c"] != 255) {
//        // todo: get SCL and SDA of this i2c
//        if (i2cdev_init() != ESP_OK)
//        {
//            ESP_LOGI(TAG, "Could not init I2Cdev library\n");
//            return false;
//        }
//
//        if (bmp280_init_desc(&dev, BMP280_I2C_ADDRESS_0, 0, SDA_GPIO, SCL_GPIO) != ESP_OK)
//        {
//            ESP_LOGI(TAG, "Could not init device descriptor\n");
//            return false;
//        }
//
//        if ((res = bmp280_init(&dev, &params)) != ESP_OK)
//        {
//            ESP_LOGI(TAG, "Could not init BMP280, err: %d\n", res);
//            return false;
//        }
//
//        type = dev.id == BME280_CHIP_ID ? 1 : 2;
//        ESP_LOGI(TAG, "BMP280: found %s\n", type == 1 ? "BME280" : "BMP280");
//    }

    xTaskCreatePinnedToCore(this->task, TAG, 4096, this, 5, NULL, 1);
    return true;
}


bool BMP280Plugin::setConfig(JsonObject &params) {
    if (params.containsKey("gpio")) {
        (*cfg)["i2c"] = params["i2c"];
    }
    if (params.containsKey("interval")) {
        (*cfg)["interval"] = params["interval"];
    }
    return true;
}

bool BMP280Plugin::getConfig(JsonObject &params) {
    params["interval"] = (*cfg)["interval"];
    params["i2c"] = (*cfg)["i2c"];
    return true;
}

bool BMP280Plugin::setState(JsonObject &params) {
    return true;
}

bool BMP280Plugin::getState(JsonObject &params) {
    params["temperature"] = temperature;
    params["pressure"] = pressure;
    params["humidity"] = humidity;
    return true;
}
