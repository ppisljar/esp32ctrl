#include "p021_mlx90614.h"
#include "c001_i2c.h"

static const char *TAG = "Mlx90614Plugin";

PLUGIN_CONFIG(Mlx90614Plugin, interval, clk, cs, data, type)

void Mlx90614Plugin::task(void * pvParameters)
{
    Mlx90614Plugin* s = (Mlx90614Plugin*)pvParameters;
    JsonObject &cfg = *(s->cfg);

    for( ;; )
    {
        // Task code goes here.
        int interval = cfg["interval"] | 60;

        if (interval == 0) interval = 60;
        
        s->temp = s->read16(MLX90614_TOBJ1) * 0.02 - 273.15;
        s->tempAmb = s->read16(MLX90614_TA) * 0.02 - 273.15;

        SET_STATE(s, temperature, 0, true, te_eval(s->temp_expr), 5);
        ESP_LOGI(TAG, "Temp: %f, TempA: %f, temperature: %f", s->temp, s->tempAmb, s->temperature);

        vTaskDelay(interval * 1000 / portTICK_PERIOD_MS);
    }
}

uint8_t Mlx90614Plugin::crc8 (uint8_t inCrc, uint8_t inData)
{
	uint8_t i;
	uint8_t data;
	data = inCrc ^ inData;
	for ( i = 0; i < 8; i++ )
	{
		if (( data & 0x80 ) != 0 )
		{
			data <<= 1;
			data ^= 0x07;
		}
		else
		{
			data <<= 1;
		}
	}
	return data;
}

uint16_t Mlx90614Plugin::read16(uint8_t reg) {
    i2c_cmd_handle_t cmd = i2c_cmd_link_create();
    i2c_master_start(cmd);
    i2c_master_write_byte(cmd, (addr << 1) | I2C_MASTER_WRITE, ACK_CHECK_EN);
    i2c_master_write_byte(cmd, reg, ACK_CHECK_EN);

    
    //i2c_master_stop(cmd);

    esp_err_t ret = iot_i2c_bus_cmd_begin(i2c_plugin->i2c_bus, cmd, 1000 / portTICK_RATE_MS);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "error select %d register %d : %d", addr, reg, ret);
    }
    i2c_cmd_link_delete(cmd);

    cmd = i2c_cmd_link_create();
    i2c_master_start(cmd);
    i2c_master_write_byte(cmd, (addr << 1) | I2C_MASTER_READ, ACK_CHECK_EN);
    uint8_t msb, lsb, pec;
    
    i2c_master_read_byte(cmd, &lsb, (i2c_ack_type_t)ACK_VAL);
    i2c_master_read_byte(cmd, &msb, (i2c_ack_type_t)ACK_VAL);
    i2c_master_read_byte(cmd, &pec, (i2c_ack_type_t)NACK_VAL);
    i2c_master_stop(cmd);

    ret = iot_i2c_bus_cmd_begin(i2c_plugin->i2c_bus, cmd, 1000 / portTICK_RATE_MS);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "error %d", ret);
    }
    i2c_cmd_link_delete(cmd);

    uint8_t crc = crc8(0, (addr << 1));
	crc = crc8(crc, reg);
	crc = crc8(crc, (addr << 1) + 1);
	crc = crc8(crc, lsb);
	crc = crc8(crc, msb);
	
	if (crc == pec)
	{
		return (msb << 8) | lsb;
	}
	else
	{
        ESP_LOGW(TAG, "error, pec does not match crc8: %d : %d, msb: %d, lsb: %d", pec, crc, msb, lsb);
        return (msb << 8) | lsb;
		return 0;
	}
}


bool Mlx90614Plugin::init(JsonObject &params) {
    cfg = &((JsonObject &)params["params"]);
    state_cfg = &((JsonArray &)params["state"]["values"]);

    addr = (*cfg)["addr"] | 255;

    if (i2c_plugin == nullptr || i2c_plugin->i2c_bus == nullptr) {
        ESP_LOGW(TAG, "I2C not started, skipping");
        return false;
    }

    te_variable vars_temp[] = {{"x", &temp}};
    const char *temp_formula = (*state_cfg)[0]["formula"] | "x";
    temp_expr = te_compile(temp_formula, vars_temp, 1, 0);
   
    if (addr != 255) {
        ESP_LOGI(TAG, "starting Mlx90614Plugin on addr %d with formula %s", addr, temp_formula);
        xTaskCreatePinnedToCore(this->task, TAG, 4096, this, 5, &task_h, 1);
    }

    return true;
}

bool Mlx90614Plugin::getState(JsonObject &params) {
    
    char *stateName = (char*)(*state_cfg)[0]["name"].as<char*>();
    params[stateName] = temp;

    stateName = (char*)(*state_cfg)[1]["name"].as<char*>();
    params[stateName] = tempAmb;

    ESP_LOGI(TAG, "reading state: %s", stateName);
    return true;
}

bool Mlx90614Plugin::setState(JsonObject &params) {
    return true;
    
}

void* Mlx90614Plugin::getStateVarPtr(int n, Type *t) { 
    if (n > 0) return nullptr;
    if (t != nullptr) *t = Type::decimal;
    return &temperature; 
} 

void Mlx90614Plugin::setStateVarPtr_(int n, void *val, Type t, bool shouldNotify) {
}

Mlx90614Plugin::~Mlx90614Plugin() {
    
}
