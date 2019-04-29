#include "pXXX_template.h"

static const char *TAG = "TemplatePlugin";

PLUGIN_CONFIG(TemplatePlugin, setting_1, setting_2)  // macro for plugin definition, list your settings
PLUGIN_STATS(TemplatePlugin, state_1, state_2); // macro for plugin definition, list your states

void TemplatePlugin::task(void * pvParameters)
{
    TemplatePlugin* s = (TemplatePlugin*)pvParameters;
    JsonObject &cfg = *(s->cfg);

    // setup
    uint8_t val = io.digitalRead(0);        // use io. service for io access
                                            // io.digitalRead(pinNr)
                                            // io.digitalWrite(pinNr, value)
                                            // io.analogRead(pinNr)
                                            // io.analogWrite(pinNr, value)

    for( ;; )                               // creates main loop
    {
        // loop
        SET_STATE(s, state_1, 0, true, 100);    // set state_1 to 100
        SET_STATE(s, state_2, 0, true, false);  // set state_2 to false
        
        ESP_LOGI(TAG, "state 1 is %d", state_1);// ESP_LOGI, ESP_LOGW, ESP_LOGE
        vTaskDelay(1000 / portTICK_PERIOD_MS);  // once per second
    }
}

#define CMD_EXEC_PXX 10

bool TemplatePlugin::init(JsonObject &params) {
    cfg = &((JsonObject &)params["params"]);
    state_cfg = &((JsonArray &)params["state"]["values"]);

    setting_1 = (*cfg)["setting_1"];    // reads settings from config json to internal var
    setting_2 = (*cfg)["setting_2"];    //

    // register new command to rule engine
    register_command(CMD_EXEC_PXX, [setting_1](uint8_t *cmd) { 
        // what to run when rules execute    
        setting_1 = cmd[0];
        
    };)

    xTaskCreatePinnedToCore(this->task, TAG, 4096, this, 5, NULL, 1);   // starts task
    return true;
}