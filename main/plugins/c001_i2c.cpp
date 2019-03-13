#include "c001_i2c.h"

const char *C001_TAG = "I2CPlugin";

bool I2CPlugin::init(JsonObject &params) {
    cfg = &params;
    if (!params.containsKey("port")) {
        params.set("port", 0);
    }
    if (!params.containsKey("sda")) {
        params.set("sda", 255);
    }
    if (!params.containsKey("scl")) {
        params.set("scl", 255);
    }
    if (!params.containsKey("freq")) {
        params.set("freq", 100000);
    }
    ESP_LOGI(C001_TAG, "init");

    int i2c_master_port = params["port"] | 0; //I2C_MASTER_NUM;
    i2c_config_t conf;
    conf.mode = I2C_MODE_MASTER;
    conf.sda_io_num = (gpio_num_t)params["sda"].as<int>();
    conf.sda_pullup_en = GPIO_PULLUP_ENABLE;
    conf.scl_io_num = (gpio_num_t)params["scl"].as<int>();
    conf.scl_pullup_en = GPIO_PULLUP_ENABLE;
    conf.master.clk_speed = (int)params["freq"];
    i2c_param_config((i2c_port_t)i2c_master_port, &conf);

    return i2c_driver_install((i2c_port_t)i2c_master_port, conf.mode, 0, 0, 0);
}

bool I2CPlugin::setConfig(JsonObject &params) {
    if (params.containsKey("sda")) {
        (*cfg)["sda"] = params["sda"];
    }
    if (params.containsKey("scl")) {
        (*cfg)["scl"] = params["scl"];
    }
    if (params.containsKey("freq")) {
        (*cfg)["freq"] = params["freq"];
    }
    return true;
}

bool I2CPlugin::getConfig(JsonObject &params) {
    params["freq"] = (*cfg)["freq"];
    params["sda"] = (*cfg)["sda"];
    params["scl"] = (*cfg)["scl"];
    return true;
}

bool I2CPlugin::setState(JsonObject &params) {
    if (params.containsKey("state")) {
        state = params["state"];
    }
    return true;
}

bool I2CPlugin::getState(JsonObject &params) {
    params["state"] = state;
    return true;
}

void* I2CPlugin::getStatePtr(uint8_t val) {
    ESP_LOGD(C001_TAG, "return state ptr %d (%p)", val, &state);
    if (val == 0) return &state;
    return NULL;
}

void I2CPlugin::setStatePtr(uint8_t n, uint8_t *val) {
    if (n == 0) state = *val;
}

void I2CPlugin::scan() {
    uint8_t address;
    printf("     0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f\r\n");
    for (int i = 0; i < 128; i += 16) {
        printf("%02x: ", i);
        for (int j = 0; j < 16; j++) {
            fflush(stdout);
            address = i + j;
            i2c_cmd_handle_t cmd = i2c_cmd_link_create();
            i2c_master_start(cmd);
            i2c_master_write_byte(cmd, (address << 1) | I2C_MASTER_WRITE, ACK_CHECK_EN);
            i2c_master_stop(cmd);
            esp_err_t ret = i2c_master_cmd_begin((i2c_port_t)0, cmd, 50 / portTICK_RATE_MS);
            i2c_cmd_link_delete(cmd);
            if (ret == ESP_OK) {
                printf("%02x ", address);
            } else if (ret == ESP_ERR_TIMEOUT) {
                printf("UU ");
            } else {
                printf("-- ");
            }
        }
        printf("\r\n");
    }

}