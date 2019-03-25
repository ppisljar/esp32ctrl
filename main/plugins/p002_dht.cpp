#include "p002_dht.h"

const char *P002_TAG = "DHTPlugin";

PLUGIN_CONFIG(DHTPlugin, interval, gpio, type)
PLUGIN_STATS(DHTPlugin, temperature, humidity)

void DHTPlugin::task(void * pvParameters)
{
    DHTPlugin* s = (DHTPlugin*)pvParameters;
    JsonObject &cfg = *(s->cfg);

    ESP_LOGI(P002_TAG, "main task: %i:%i", (unsigned)s, unsigned(s->cfg));
    for( ;; )
    {
        int interval = cfg["interval"] | 60;
        int gpio = cfg["gpio"] | 255;
        if (interval == 0) interval = 60;
        
        // int sensor_type = cfg["type"] | 0;
        // if (sensor_type > 1) sensor_type = 1;

        if (gpio != 255) {
            int ret = readDHT();
		    errorHandler(ret);
            s->temp[0] = getTemperature();
            s->temp[1] = getHumidity();
            SET_STATE(s, temperature, 0, true, te_eval(s->temp_expr));
            SET_STATE(s, humidity, 1, true, te_eval(s->humi_expr));
            ESP_LOGI(P002_TAG, "Humidity: %f%% Temp: %fC", s->humidity, s->temperature);
        }
        vTaskDelay(interval * 1000 / portTICK_PERIOD_MS);
    }
}

bool DHTPlugin::init(JsonObject &params) {
    cfg = &((JsonObject &)params["params"]);
    state_cfg = &((JsonArray &)params["state"]);
    
    int gpio = (*cfg)["gpio"] | 255;

    te_variable vars_temp[] = {{"x", &temp[0]}};
    te_variable vars_humi[] = {{"x", &temp[1]}};
    temp_expr = te_compile((*state_cfg)[0]["formula"].as<char*>(), vars_temp, 1, 0);
    humi_expr = te_compile((*state_cfg)[1]["formula"].as<char*>(), vars_humi, 1, 0);

    if (gpio != 255) {
        setDHTgpio( gpio );
        xTaskCreatePinnedToCore(this->task, P002_TAG, 4096, this, 5, NULL, 1);
    }
    return true;
}
