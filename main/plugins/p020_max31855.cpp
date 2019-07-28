#include "p020_max31855.h"

static const char *TAG = "Max31855Plugin";

PLUGIN_CONFIG(Max31855Plugin, interval, clk, cs, data, type)

void Max31855Plugin::task(void * pvParameters)
{
    Max31855Plugin* s = (Max31855Plugin*)pvParameters;
    JsonObject &cfg = *(s->cfg);

    for( ;; )
    {
        // Task code goes here.
        int interval = cfg["interval"] | 60;

        if (interval == 0) interval = 60;

        s->getData();
        SET_STATE(s, temperature, 0, true, te_eval(s->temp_expr), 5);
        ESP_LOGI(TAG, "themmocouple Temp: %f, TempRJ: %i, TempTherm: %i, temperature: %f", s->temp, s->tempRJ, s->tempTherm, s->temperature);

        vTaskDelay(interval * 1000 / portTICK_PERIOD_MS);
    }
}

void Max31855Plugin::getData(void) {
    gpio_set_level(gpio_num_t(cs), 0);  //select MAX31855
    //get the 32 bits from MAX31855
    //   generate clock pulse high, then read data bit, then clock pulse low

    int32_t rawData = 0;
    int8_t valueBit;
    //get 32 bits of data from MAX31855
    for(int i=0;i<31;i++) {
        gpio_set_level(gpio_num_t(clk), 1);  //clock pulse going high - start pulse
        valueBit = gpio_get_level(gpio_num_t(data));  //get bit
        rawData <<= 1;
        rawData += 0x01 & valueBit;  
        gpio_set_level(gpio_num_t(clk), 0);  //clock pulse going low - end pulse
    }
    gpio_set_level(gpio_num_t(cs), 1); //de-select MAX31855

    //fault = rawData & 0x10000;
    //error = rawData & 0x7;
    int16_t rjData = (uint16_t(rawData) & 0x7FF0) >> 4; 
    tempRJ = float(rjData) * 0.0625;

    int16_t thermData = (rawData >> 18);
    tempTherm = float(thermData) * .25;

    temp = (float(thermData) * .25) + tempRJ;

}

bool Max31855Plugin::init(JsonObject &params) {
    cfg = &((JsonObject &)params["params"]);
    state_cfg = &((JsonArray &)params["state"]["values"]);

    cs = (*cfg)["cs"] | 255;
    clk = (*cfg)["clk"] | 255;
    data = (*cfg)["data"] | 255;
    type = (*cfg)["type"] | 0;

    te_variable vars_temp[] = {{"x", &temp}};
    const char *temp_formula = (*state_cfg)[0]["formula"] | "x";
    temp_expr = te_compile(temp_formula, vars_temp, 1, 0);
    temp = 150;
    ESP_LOGI(TAG, "test %f", te_eval(temp_expr));
   
    if (cs != 255 && clk != 255 && data != 255) {
        gpio_set_direction((gpio_num_t)cs, GPIO_MODE_OUTPUT);
        gpio_set_direction((gpio_num_t)clk, GPIO_MODE_OUTPUT);
        gpio_set_direction((gpio_num_t)data, GPIO_MODE_INPUT);
        ESP_LOGI(TAG, "starting thermocouple with formula %s", temp_formula);
        xTaskCreatePinnedToCore(this->task, TAG, 4096, this, 5, &task_h, 1);
    }

    return true;
}

bool Max31855Plugin::getState(JsonObject &params) {
    
    char *stateName = (char*)(*state_cfg)[0]["name"].as<char*>();
    params[stateName] = temp;

    ESP_LOGI(TAG, "reading state: %s", stateName);
    return true;
}

bool Max31855Plugin::setState(JsonObject &params) {
    return true;
    
}

void* Max31855Plugin::getStateVarPtr(int n, Type *t) { 
    if (n > 0) return nullptr;
    if (t != nullptr) *t = Type::decimal;
    return &temperature; 
} 

void Max31855Plugin::setStateVarPtr_(int n, void *val, Type t, bool shouldNotify) {
}

Max31855Plugin::~Max31855Plugin() {
    
}
