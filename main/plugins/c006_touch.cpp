#include "c006_touch.h"

static const char *TAG = "TouchPlugin";

PLUGIN_CONFIG(TouchPlugin, t1_enabled, t2_enabled, t3_enabled, t4_enabled)
PLUGIN_STATS(TouchPlugin, state, state)

static bool s_pad_activated[TOUCH_PAD_MAX];
static uint32_t s_pad_init_val[TOUCH_PAD_MAX];

static void c006_touch_rtc_intr(void * arg)
{
    uint32_t pad_intr = touch_pad_get_status();
    //clear interrupt
    touch_pad_clear_status();
    for (int i = 0; i < TOUCH_PAD_MAX; i++) {
        if ((pad_intr >> i) & 0x01) {
            s_pad_activated[i] = true;
        }
    }
}

void TouchPlugin::task(void * pvParameters)
{
    TouchPlugin* s = (TouchPlugin*)pvParameters;
    JsonObject &cfg = *(s->cfg);

    ESP_LOGD(TAG, "main task: %i:%i", (unsigned)s, unsigned(s->cfg));
    for( ;; )
    {
        for (int i = 0; i < TOUCH_PAD_MAX; i++) {
            if (s_pad_activated[i] == true) {
                ESP_LOGI(TAG, "T%d activated!", i);
                // Wait a while for the pad being released
                vTaskDelay(200 / portTICK_PERIOD_MS);
                uint16_t touch_value;
                touch_pad_read_filtered((touch_pad_t)i, &touch_value);
                ESP_LOGI(TAG, "value: %d", touch_value);
                // Clear information on pad activation
                s_pad_activated[i] = false;
                if (rule_engine_touch_triggers[i] != nullptr) {
                    ESP_LOGI(TAG, "running rule %p", rule_engine_touch_triggers[i]);
                    run_rule(rule_engine_touch_triggers[i], nullptr, 0, 255);
                }
            }
        }
        vTaskDelay(100 / portTICK_PERIOD_MS);
    }
}

bool TouchPlugin::init(JsonObject &params) {
    //cfg = &((JsonObject &)params);
    //state_cfg = &((JsonArray &)params["state"]);

    touch_pad_init();
    // If use interrupt trigger mode, should set touch sensor FSM mode at 'TOUCH_FSM_MODE_TIMER'.
    touch_pad_set_fsm_mode(TOUCH_FSM_MODE_TIMER);
    // Set reference voltage for charging/discharging
    // For most usage scenarios, we recommend using the following combination:
    // the high reference valtage will be 2.7V - 1V = 1.7V, The low reference voltage will be 0.5V.
    touch_pad_set_voltage(TOUCH_HVOLT_2V7, TOUCH_LVOLT_0V5, TOUCH_HVOLT_ATTEN_1V);
    // Init touch pad IO
    

    uint16_t touch_value;
    uint8_t touch_pins[10] = { 4, 0, 2, 15, 13, 12, 14, 27, 33, 32 };

    for (int i = 0; i < 10; i++) {
        if (params["hardware"]["gpio"][touch_pins[i]]["mode"] != 4) continue;

        touch_pad_config((touch_pad_t)i, TOUCH_THRESH_NO_USE);
    }


    touch_pad_filter_start(TOUCHPAD_FILTER_TOUCH_PERIOD);

    for (int i = 0; i < 10; i++) {
        //read filtered value
        touch_pad_read_filtered((touch_pad_t)i, &touch_value);
        s_pad_init_val[i] = touch_value;
        ESP_LOGI(TAG, "test init: touch pad [%d] val is %d", i, touch_value);
        //set interrupt threshold.
        ESP_ERROR_CHECK(touch_pad_set_thresh((touch_pad_t)i, touch_value * 2 / 2));

    }

    

    // Register touch interrupt ISR
    touch_pad_isr_register(c006_touch_rtc_intr, NULL);  
    touch_pad_intr_enable();

    xTaskCreatePinnedToCore(this->task, TAG, 4096, this, 5, NULL, 1);

    return true;
}

