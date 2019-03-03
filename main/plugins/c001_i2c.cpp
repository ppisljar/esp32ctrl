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

//esp_err_t I2CPlugin::write(uint8_t addr, uint8_t *data_wr, size_t size)
//{
//    JsonObject& params = *cfg;
//    i2c_cmd_handle_t cmd = i2c_cmd_link_create();
//    i2c_master_start(cmd);
//    i2c_master_write_byte(cmd, (addr << 1) | I2C_MASTER_WRITE, ACK_CHECK_EN);
//    i2c_master_write(cmd, data_wr, size, ACK_CHECK_EN);
//    i2c_master_stop(cmd);
//    esp_err_t ret = i2c_master_cmd_begin((i2c_i2c_driver_installport_t)params["port"].as<int>(), cmd, 1000 / portTICK_RATE_MS);
//    i2c_cmd_link_delete(cmd);
//    return ret;
//}
//
//esp_err_t I2CPlugin::read(uint8_t addr, uint8_t *data_rd, size_t size)
//{
//    JsonObject& params = *cfg;
//    if (size == 0) {
//        return ESP_OK;
//    }
//    i2c_cmd_handle_t cmd = i2c_cmd_link_create();
//    i2c_master_start(cmd);
//    i2c_master_write_byte(cmd, (addr << 1) | I2C_MASTER_READ, ACK_CHECK_EN);
//    if (size > 1) {
//        i2c_master_read(cmd, data_rd, size - 1, (i2c_ack_type_t)ACK_VAL);
//    }
//    i2c_master_read_byte(cmd, data_rd + size - 1, (i2c_ack_type_t)NACK_VAL);
//    i2c_master_stop(cmd);
//    esp_err_t ret = i2c_master_cmd_begin((i2c_port_t)params["port"].as<int>(), cmd, 1000 / portTICK_RATE_MS);
//    i2c_cmd_link_delete(cmd);
//    return ret;
//}
//
//esp_err_t I2CPlugin::readReg8(uint8_t addr, uint8_t *val) {
//    return read(addr, val, 1);
//}
//
//esp_err_t I2CPlugin::writeReg8(uint8_t addr, uint8_t *val) {
//    return write(addr, val, 1);
//}
//
//esp_err_t I2CPlugin::readReg16(uint8_t addr, uint8_t *val) {
//    return read(addr, val, 2);
//}
//
//esp_err_t I2CPlugin::writeReg16(uint8_t addr, uint8_t *val) {
//    return write(addr, val, 2);
//}
//
//bool I2CPlugin::readBitReg8(uint8_t addr, uint8 bit) {
//    uint8_t reg = 0;
//    readReg8(addr, &reg);
//    return (reg & BV(bit)) >> bit;
//}
//
//bool I2CPlugin::readBitReg16(uint8_t addr, uint8 bit) {
//    uint16_t reg = 0;
//    readReg16(addr, &reg);
//    return (reg & BV(bit)) >> bit;
//}
//
//esp_err_t I2CPlugin::writeBitReg8(uint8_t addr, uint8 bit, uint8_t val) {
//    uint8_t reg = 0;
//    readReg8(addr, &reg);
//    reg = (reg & ~BV(bit)) | (val ? BV(bit) : 0);
//    writeReg8(addr, &reg);
//    return ESP_OK;
//}
//
//esp_err_t I2CPlugin::writeBitReg16(uint8_t addr, uint8 bit, uint8_t val) {
//    uint16_t reg = 0;
//    readReg16(addr, &reg);
//    reg = (reg & ~BV(bit)) | (val ? BV(bit) : 0);
//    writeReg16(addr, &reg);
//    return ESP_OK;
//}

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

