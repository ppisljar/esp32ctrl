#include "p017_vml6040.h"
#include "c001_i2c.h"

static const char *TAG = "VEML6040Plugin";

PLUGIN_CONFIG(VEML6040Plugin, interval, addr)
PLUGIN_STATS(VEML6040Plugin, r, g, b, w, l)

void VEML6040Plugin::task(void * pvParameters)
{
    VEML6040Plugin* s = (VEML6040Plugin*)pvParameters;
    JsonObject &cfg = *(s->cfg);

    for( ;; )
    {
        int interval = cfg["interval"] | 60;
        if (interval == 0) interval = 60;
        

        if (s->dev != nullptr) {
            
            SET_STATE(s, r, 0, true, iot_veml6040_get_red(s->dev), 2);
            SET_STATE(s, g, 1, true, iot_veml6040_get_blue(s->dev), 2);
            SET_STATE(s, b, 2, true, iot_veml6040_get_green(s->dev), 2);
            SET_STATE(s, w, 3, true, iot_veml6040_get_white(s->dev), 2);
            SET_STATE(s, l, 4, true, iot_veml6040_get_lux(s->dev), 5);
        }
        vTaskDelay(interval * 1000 / portTICK_PERIOD_MS);
    }
}

bool VEML6040Plugin::init(JsonObject &params) {
    cfg = &((JsonObject &)params["params"]);
    state_cfg = &((JsonArray &)params["state"]["values"]);
    
    int addr = (*cfg)["addr"] | 255;

    if (addr != 255) {
        dev = iot_veml6040_create(i2c_plugin->i2c_bus, addr);
        xTaskCreatePinnedToCore(this->task, TAG, 4096, this, 5, NULL, 1);
    }
    return true;
}
