#include "p006_analog.h"
#include "math.h"

static const char *TAG = "AnalogPlugin";

PLUGIN_CONFIG(AnalogPlugin, interval, gpio, type)
PLUGIN_STATS(AnalogPlugin, value, value)

void AnalogPlugin::task(void * pvParameters)
{
    AnalogPlugin* s = (AnalogPlugin*)pvParameters;
    JsonObject &cfg = *(s->cfg);

    uint32_t t_notify = xTaskGetTickCount() * portTICK_PERIOD_MS;
    for( ;; )
    {
        int interval = cfg["interval"] | 60;
        int gpio = cfg["gpio"] | 255;
        int samples = cfg["samples"] | 1;
        int notifyInterval = cfg["notify_interval"] | 60;
        uint8_t ac = cfg["ac"] | 0;
        if (interval == 0) interval = 60;
        int zero = 1865;

        if (gpio != 255) {

            uint32_t result = 0;
            for (int i = 0; i < samples; i++) {
                if (ac) {
                    // averaging AC samples
                    uint32_t period = 1000 / 60; // 60hz frequency
                    uint32_t t_start = xTaskGetTickCount() * portTICK_PERIOD_MS;

                    uint32_t Isum = 0, measurements_count = 0;
                    int32_t Inow;

                    while ((xTaskGetTickCount() * portTICK_PERIOD_MS) - t_start < period) {
                        Inow = io.analogRead(gpio) - zero;
                        //ESP_LOGI(TAG, "partial analog read %d, %d", Inow, measurements_count);
                        Isum += Inow*Inow;
                        measurements_count++;
                    }

                    result += Isum / measurements_count;
                } else {
                    uint16_t x = io.analogRead(gpio);
                    result += x;
                }

            }
            int16_t x = result / samples;

            s->temp = x;
            ESP_LOGD(TAG, "analog read %f", s->temp);
            s->value = te_eval(s->expr);
            ESP_LOGD(TAG, "analog read calc %f", s->value);
            if ((xTaskGetTickCount() * portTICK_PERIOD_MS) - t_notify >= notifyInterval * 1000) {
                t_notify = (xTaskGetTickCount() * portTICK_PERIOD_MS);
                SET_STATE(s, value, 0, true, s->value, Type::decimal);
            }
        }

        vTaskDelay(interval / portTICK_PERIOD_MS);
    }
}

// TODO: update to use analog ios
bool AnalogPlugin::init(JsonObject &params) {
    cfg = &((JsonObject &)params["params"]);
    state_cfg = &((JsonArray &)params["state"]["values"]);

    int gpio = (*cfg)["gpio"] | 255;
    int atten = (*cfg)["atten"] | 3;

    (*state_cfg)[0]["readonly"] = "true";
    (*state_cfg)[0]["device_class"] = "current";
    (*state_cfg)[0]["unit"] = "A";
    (*state_cfg)[0]["notify"] = "false";

    adc1_config_width(ADC_WIDTH_BIT_12);

    if (gpio != 255) {

        te_variable vars_formula[] = {{"x", &temp}};
        const char *formula = (*state_cfg)[0]["formula"] | "x";
        expr = te_compile(formula, vars_formula, 1, 0);

        io.analogInit(gpio, atten);
        
        xTaskCreatePinnedToCore(this->task, TAG, 4096, this, 5, &task_h, 1);
    }

    return true;
}

AnalogPlugin::~AnalogPlugin() {
    if (task_h) vTaskDelete(task_h);
}
