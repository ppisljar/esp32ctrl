#include "p015_dimmer.h"


#include <soc/ledc_struct.h>


static const char *TAG = "DimmerPlugin";

PLUGIN_CONFIG(DimmerPlugin, interval, gpio_zc, outputs)
PLUGIN_STATS(DimmerPlugin, state[0], state[1], state[2], state[3], state[4], state[5], state[6], state[7]);

#define MIN(x, y) ((x > y) ? y : x);
#define MAX(x, y) ((x > y) ? x : y);

#define HZ 50
#define DUTY_BIT_DEPTH 10
// TRIAC is kept high for TRIAC_GATE_IMPULSE_CYCLES PWM counts before setting low.
#define TRIAC_GATE_IMPULSE_CYCLES 10

// TRIAC is always set low at least TRIAC_GATE_QUIESCE_CYCLES PWM counts before the next zero crossing.
#define TRIAC_GATE_QUIESCE_CYCLES 50

struct dimmer_pins_t {
    gpio_num_t gpio;
    esp_timer_handle_t timer;
    uint32_t delay;
};

struct dimmer_pins_t *dimmer_pins[8];

int16_t cnt_D = 0;

static void timer_callback(void* arg)
{
    //ESP_LOGI(TAG, "interrupts last second: %d", cnt_D);
    //cnt_D = 0;
    uint32_t gpio_num = (uint32_t) arg;
    GPIO.out_w1ts = 1 << gpio_num;
    ets_delay_us(100);
    GPIO.out_w1tc = 1 << gpio_num;

}

static void IRAM_ATTR dimmer_isr_handler(void* arg)
{
    
    uint32_t gpio_num = (uint32_t) arg;
    uint32_t intr_st = GPIO.status;
    if (intr_st & (1 << gpio_num)) {
        for (int i = 0; i < 100; ++i) {}
        if (GPIO.in & (1 << gpio_num)) {
            cnt_D++;        

            // Zero the PWM timer at the zero crossing.
            LEDC.timer_group[0].timer[0].conf.rst = 1;
            LEDC.timer_group[0].timer[0].conf.rst = 0;

            // set gpio outputs (all)
            for (uint8_t i = 0;  i < 8; i++) {
                if (dimmer_pins[i] == nullptr) break;

                uint8_t channel = i;
                uint32_t hpoint = MIN((1 << DUTY_BIT_DEPTH) - 1, (1 << DUTY_BIT_DEPTH) - dimmer_pins[i]->delay);

                // Don't get too close to the zero crossing or the TRIAC will turn immediately off at highest
                // brightness.
                hpoint = MAX(TRIAC_GATE_QUIESCE_CYCLES, hpoint);
                if (hpoint >= (1 << DUTY_BIT_DEPTH) - 1 - TRIAC_GATE_IMPULSE_CYCLES) {
                    // If hpoint if very close to the maximum value, ie mostly off, simply turn off
                    // the output to avoid glitch where hpoint exceeds duty.
                    LEDC.channel_group[0].channel[channel].conf0.sig_out_en = 0;
                } else {
                    LEDC.channel_group[0].channel[channel].hpoint.hpoint = hpoint;
                    LEDC.channel_group[0].channel[channel].duty.duty = TRIAC_GATE_IMPULSE_CYCLES << 4;
                    LEDC.channel_group[0].channel[channel].conf0.sig_out_en = 1;
                    LEDC.channel_group[0].channel[channel].conf1.duty_start = 1;
                }
            }
        }
    }
}


bool DimmerPlugin::init(JsonObject &params) {
    cfg = &((JsonObject &)params["params"]);
    state_cfg = &((JsonArray &)params["state"]["values"]);

    gpio_zc = (*cfg)["gpio_zc"] | 255;
    JsonArray &outputs = (*cfg)["outputs"];
    
    if (gpio_zc != 255) {
        io.setDirection(gpio_zc, GPIO_MODE_INPUT);
        gpio_set_intr_type((gpio_num_t)gpio_zc, GPIO_INTR_POSEDGE);
        gpio_set_pull_mode((gpio_num_t)gpio_zc, GPIO_PULLDOWN_ONLY);
        gpio_isr_handler_add((gpio_num_t)gpio_zc, dimmer_isr_handler, (void*)gpio_zc);

        ledc_timer_config_t timer_config = {};
        timer_config.speed_mode = LEDC_HIGH_SPEED_MODE;
        timer_config.timer_num = (ledc_timer_t)0;
        timer_config.bit_num = (ledc_timer_bit_t)DUTY_BIT_DEPTH;
        timer_config.freq_hz = HZ * 2;
        ESP_ERROR_CHECK( ledc_timer_config(&timer_config) );

        uint8_t i = 0;
        for (auto output : outputs) {
            if (i == 8) {
                ESP_LOGW(TAG, "too many outputs defined");
                break;
            }
            ESP_LOGI(TAG, "adding output on pin %d", output.as<uint8_t>());
            io.setDirection(output.as<uint8_t>(), GPIO_MODE_INPUT_OUTPUT);
            dimmer_pins[i] = (dimmer_pins_t*)malloc(sizeof(dimmer_pins_t));
            dimmer_pins[i]->gpio = (gpio_num_t)output.as<uint8_t>();
            dimmer_pins[i]->delay = 0;

            ledc_channel_config_t led_config = {};
            led_config.gpio_num = dimmer_pins[i]->gpio;
            led_config.speed_mode = LEDC_HIGH_SPEED_MODE;
            led_config.channel = (ledc_channel_t)i;
            led_config.timer_sel = LEDC_TIMER_0;
            led_config.duty = (1 << DUTY_BIT_DEPTH) - 1;
            led_config.intr_type = LEDC_INTR_DISABLE;
            ESP_ERROR_CHECK( ledc_channel_config(&led_config) );
            LEDC.channel_group[0].channel[i].duty.duty = TRIAC_GATE_IMPULSE_CYCLES << 4;
            // Initial brightness of 0, meaning turn TRIAC on at very end:
            LEDC.channel_group[0].channel[i].hpoint.hpoint = (1 << DUTY_BIT_DEPTH) - 1;
            LEDC.channel_group[0].channel[i].conf0.sig_out_en = 1;
            LEDC.channel_group[0].channel[i].conf1.duty_start = 1;

            i++;
        }
    }

    return true;
}

void DimmerPlugin::setStatePtr_(uint8_t n, uint8_t *val, bool shouldNotify) {

    if (n < 8 && state[n] != *val) {
        //SET_STATE(this, state[n], n, shouldNotify, *val, 1);
        dimmer_pins[n]->delay = 4 * (*val);
        //ESP_LOGI(TAG, "updating state %d (%p) [%d]", n, &state, state);
    } else {
        ESP_LOGW(TAG, "invalid state id: %d", n);
    }
}
