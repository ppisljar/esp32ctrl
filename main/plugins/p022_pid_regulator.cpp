#include "p022_pid_regulator.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

extern Plugin* active_plugins[50];

static const char *TAG = "PIDRegulatorPlugin";

PLUGIN_CONFIG(PIDRegulatorPlugin, interval, device, value, level, p, i, d, f)
PLUGIN_STATS(PIDRegulatorPlugin, output, output)

void PIDRegulatorPlugin::task(void * pvParameters)
{
    PIDRegulatorPlugin* s = (PIDRegulatorPlugin*)pvParameters;
    JsonObject &cfg = *(s->cfg);
    int interval = cfg["interval"] | 60;
    int device = cfg["device"] | 255;
    int targetValue = 0;
    if (interval == 0) interval = 60;

    ESP_LOGI(TAG, "main task: %i:%i", (unsigned)s, unsigned(s->cfg));
    for( ;; )
    {    
        if (device != 255 && active_plugins[device] != nullptr) {
            // get the device, request its stats and get the value
            JsonObject& state = (s->jb).createObject();
            active_plugins[device]->getState(state);
            float currentValue = state[cfg["value"].as<char*>()];
            SET_STATE(s, output, 0, true, s->pid->getOutput(currentValue, targetValue), 1);
            //ESP_LOGI(TAG, "current output %i (%f > %f + %f)", s->output, currentValue, level, hysteresis);
        }

        vTaskDelay(interval * 1000 / portTICK_PERIOD_MS);
    }
}

bool PIDRegulatorPlugin::init(JsonObject &params) {
    cfg = &((JsonObject &)params["params"]);
    state_cfg = &((JsonArray &)params["state"]);

    pid = new MiniPID((*cfg)["p"], (*cfg)["i"], (*cfg)["d"], (*cfg)["f"]);

    xTaskCreatePinnedToCore(this->task, TAG, 4096, this, 5, &task_h, 1);
    return true;
}

PIDRegulatorPlugin::~PIDRegulatorPlugin() {
    vTaskDelete(task_h);
}
