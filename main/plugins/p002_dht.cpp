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
        if (interval == 0) interval = 60;
        
        // int sensor_type = cfg["type"] | 0;
        // if (sensor_type > 1) sensor_type = 1;

        //if (gpio != 255) {
            int ret = readDHT();
		    errorHandler(ret);
            s->humidity = getHumidity();
            s->temperature = getTemperature();
           //if (dht_read_data((dht_sensor_type_t)sensor_type, (gpio_num_t)gpio, &(s->humidity), &(s->temperature)) == ESP_OK)
               ESP_LOGI(P002_TAG, "Humidity: %f%% Temp: %fC", s->humidity, s->temperature);
        //    else
        //        printf(P002_TAG, "Could not read data from sensor");
        //}

        vTaskDelay(interval * 1000 / portTICK_PERIOD_MS);
    }
}

bool DHTPlugin::init(JsonObject &params) {
    cfg = &((JsonObject &)params["params"]);

    int gpio = (*cfg)["gpio"] | 255;

    if (gpio != 255) {
        setDHTgpio( gpio );
        xTaskCreatePinnedToCore(this->task, P002_TAG, 4096, this, 5, NULL, 1);
    }
    return true;
}
