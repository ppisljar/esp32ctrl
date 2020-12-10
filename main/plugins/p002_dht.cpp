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
            SET_STATE(s, temperature, 0, true, s->temp[0], 5);
            SET_STATE(s, humidity, 1, true, s->temp[1], 5);
            //SET_STATE(s, temperature, 0, true, te_eval(s->temp_expr), 5);
            //SET_STATE(s, humidity, 1, true, te_eval(s->humi_expr), 5);
            ESP_LOGD(P002_TAG, "Humidity: %f%% Temp: %fC (%f%% %fC)", s->humidity, s->temperature, s->temp[0], s->temp[1]);
        }
        vTaskDelay(interval * 1000 / portTICK_PERIOD_MS);
    }
}

bool DHTPlugin::init(JsonObject &params) {
    cfg = &((JsonObject &)params["params"]);
    state_cfg = &((JsonArray &)params["state"]["values"]);
    
    int gpio = (*cfg)["gpio"] | 255;

    te_variable vars_temp[] = {{"x", &temp[0]}};
    te_variable vars_humi[] = {{"x", &temp[1]}};
    const char *temp_formula = (*state_cfg)[0]["formula"] | "x";
    const char *humi_formula = (*state_cfg)[1]["formula"] | "x";
    temp_expr = te_compile(temp_formula, vars_temp, 1, 0);
    humi_expr = te_compile(humi_formula, vars_humi, 1, 0);

    if (gpio != 255) {
        setDHTgpio( gpio );
        xTaskCreatePinnedToCore(this->task, P002_TAG, 4096, this, 5, &task_h, 1);
    }
    return true;
}

DHTPlugin::~DHTPlugin() {
    vTaskDelete(task_h);
}
