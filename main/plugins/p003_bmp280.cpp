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
        if (interval == 0) interval = 60;            

        // if (bmp280_read_float(&i2c, &temp[0], &temp[2], &tmp[1]) == ESP_OK) {
        //     SET_STATE(s, temperature, 0, true, te_eval(s->temp_expr));
        //     SET_STATE(s, humidity, 1, true, te_eval(s->humi_expr));
        //     SET_STATE(s, pressure, 2, true, te_eval(s->pres_expr));
        //     ESP_LOGI(P003_TAG, "Pressure: %.2f Pa, Temperature: %.2f C", s->pressure, s->temperature);
        // } else
        //     ESP_LOGI(P003_TAG, "Could not read data from sensor");
        // }

        vTaskDelay(interval * 1000 / portTICK_PERIOD_MS);
    }
}

bool BMP280Plugin::init(JsonObject &params) {
    cfg = &((JsonObject &)params["params"]);
    state_cfg = &((JsonArray &)params["state"]);

    te_variable vars_temp[] = {{"x", &temp[0]}};
    te_variable vars_humi[] = {{"x", &temp[1]}};
    te_variable vars_pres[] = {{"x", &temp[2]}};
    const char *temp_formula = (*state_cfg)[0]["formula"] | "x";
    const char *humi_formula = (*state_cfg)[1]["formula"] | "x";
    const char *pres_formula = (*state_cfg)[2]["formula"] | "x";
    temp_expr = te_compile(temp_formula, vars_temp, 1, 0);
    humi_expr = te_compile(humi_formula, vars_humi, 1, 0);
    pres_expr = te_compile(pres_formula, vars_pres, 1, 0);


    // if (bmp280_init_desc(&dev, BMP280_I2C_ADDRESS_0) != ESP_OK)
    // {
    //     ESP_LOGI(P003_TAG, "Could not init device descriptor\n");
    //     return false;
    // }

    // if ((res = bmp280_init(&dev, &params)) != ESP_OK)
    // {
    //     ESP_LOGI(P003_TAG, "Could not init BMP280, err: %d\n", res);
    //     return false;
    // }

    // type = dev.id == BME280_CHIP_ID ? 1 : 2;
    // ESP_LOGI(P003_TAG, "BMP280: found %s\n", type == 1 ? "BME280" : "BMP280");

    // xTaskCreatePinnedToCore(this->task, P003_TAG, 4096, this, 5, NULL, 1);
    return true;
}


