#include "p003_bmp280.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

const char *P003_TAG = "BMP280Plugin";

PLUGIN_CONFIG(BMP280Plugin, interval, i2c)
PLUGIN_STATS(BMP280Plugin, temperature, humidity, pressure)

void BMP280Plugin::task(void * pvParameters)
{
    BMP280Plugin* s = (BMP280Plugin*)pvParameters;
    JsonObject &cfg = *(s->cfg);

    ESP_LOGI(P003_TAG, "main task: %i:%i", (unsigned)s, unsigned(s->cfg));
    for( ;; )
    {
        int interval = cfg["interval"] | 60;

//        if (cfg["i2c"] != 255) {
//            if (bmp280_read_float(&i2c, &s->temperature, &s->pressure, &s->humidity) != ESP_OK)
//                ESP_LOGI(P003_TAG, "Pressure: %.2f Pa, Temperature: %.2f C", s->pressure, s->temperature);
//            else
//                printf(P003_TAG, "Could not read data from sensor");
//            }
//        }

        vTaskDelay(interval * 1000 / portTICK_PERIOD_MS);
    }
}

bool BMP280Plugin::init(JsonObject &params) {
    cfg = &((JsonObject &)params["params"]);


//    if (params["i2c"] != 255) {
//        // todo: which i2c to use
//
//        if (bmp280_init_desc(&dev, BMP280_I2C_ADDRESS_0) != ESP_OK)
//        {
//            ESP_LOGI(P003_TAG, "Could not init device descriptor\n");
//            return false;
//        }
//
//        if ((res = bmp280_init(&dev, &params)) != ESP_OK)
//        {
//            ESP_LOGI(P003_TAG, "Could not init BMP280, err: %d\n", res);
//            return false;
//        }
//
//        type = dev.id == BME280_CHIP_ID ? 1 : 2;
//        ESP_LOGI(P003_TAG, "BMP280: found %s\n", type == 1 ? "BME280" : "BMP280");
//    }

    xTaskCreatePinnedToCore(this->task, P003_TAG, 4096, this, 5, NULL, 1);
    return true;
}


