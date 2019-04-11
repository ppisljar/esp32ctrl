#include "p015_dimmer.h"

static const char *TAG = "DimmerPlugin";

PLUGIN_CONFIG(DimmerPlugin, interval, gpio_zc, outputs)
PLUGIN_STATS(DimmerPlugin, state[0], state[1], state[2], state[3], state[4], state[5], state[6], state[7]);

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
            // set gpio outputs (all)
            for (uint8_t i = 0;  i < 8; i++) {
                if (dimmer_pins[i] == nullptr) break;
                if (dimmer_pins[i]->delay == 0) {
                    GPIO.out_w1tc = 1 << dimmer_pins[i]->gpio;
                } else {
                    GPIO.out_w1ts = 1 << dimmer_pins[i]->gpio;
                    esp_timer_stop(dimmer_pins[i]->timer);
                    ESP_ERROR_CHECK(esp_timer_start_once(dimmer_pins[i]->timer, dimmer_pins[i]->delay));
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
            dimmer_pins[i]->delay = 500;
            esp_timer_create_args_t timer_args = {};
            timer_args.callback = &timer_callback;
            timer_args.arg = (void*) output.as<uint8_t>();
            timer_args.name = "dimmer";
            ESP_ERROR_CHECK(esp_timer_create(&timer_args, &dimmer_pins[i]->timer));
            i++;
        }
    }

    //ESP_ERROR_CHECK(esp_timer_start_periodic(dimmer_pins[0]->timer, 1000000));

    return true;
}

void DimmerPlugin::setStatePtr_(uint8_t n, uint8_t *val, bool shouldNotify) {

    if (n < 8 && state[n] != *val) {
        //SET_STATE(this, state[n], n, shouldNotify, *val, 1);
        dimmer_pins[n]->delay = 1000 + 30 * (*val);
        //ESP_LOGI(TAG, "updating state %d (%p) [%d]", n, &state, state);
    } else {
        ESP_LOGW(TAG, "invalid state id: %d", n);
    }
}
