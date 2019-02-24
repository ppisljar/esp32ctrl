//#include "c001_i2c.h"
//#include "freertos/FreeRTOS.h"
//#include "freertos/task.h"
//
//const char *C001_TAG = "I2CPlugin";
//
//bool I2CPlugin::init(JsonObject &params) {
//    cfg = &params;
//    if (!params.containsKey("sda")) {
//        params.set("sda", 255);
//    }
//    if (!params.containsKey("scl")) {
//        params.set("scl", 255);
//    }
//    if (!params.containsKey("freq")) {
//        params.set("freq", 100000);
//    }
//    ESP_LOGI(C001_TAG, "init");
//
//    if (i2cdev_init(0, params["sdio"], params["scl"], params["freq"]) != ESP_OK)
//    {
//        ESP_LOGI(TAG, "Could not init I2Cdev library\n");
//        return false;
//    }
//
//
////    int i2c_master_port = 0; //I2C_MASTER_NUM;
////    i2c_config_t conf;
////    conf.mode = I2C_MODE_MASTER;
////    conf.sda_io_num = params["sda"];
////    conf.sda_pullup_en = GPIO_PULLUP_ENABLE;
////    conf.scl_io_num = params["scl"];
////    conf.scl_pullup_en = GPIO_PULLUP_ENABLE;
////    conf.master.clk_speed = params["freq"];
////    i2c_param_config(i2c_master_port, &conf);
////
////    return i2c_driver_install(i2c_master_port, conf.mode,
////                              I2C_MASTER_RX_BUF_DISABLE,
////                              I2C_MASTER_TX_BUF_DISABLE, 0);
//}
//
//
//bool I2CPlugin::setConfig(JsonObject &params) {
//    if (params.containsKey("sda")) {
//        (*cfg)["sda"] = params["sda"];
//    }
//    if (params.containsKey("scl")) {
//        (*cfg)["scl"] = params["scl"];
//    }
//    if (params.containsKey("freq")) {
//        (*cfg)["freq"] = params["freq"];
//    }
//    return true;
//}
//
//bool I2CPlugin::getConfig(JsonObject &params) {
//    params["freq"] = (*cfg)["freq"];
//    params["sda"] = (*cfg)["sda"];
//    params["scl"] = (*cfg)["scl"];
//    return true;
//}
//
//bool I2CPlugin::setState(JsonObject &params) {
//    if (params.containsKey("state")) {
//        state = params["state"];
//    }
//    return true;
//}
//
//bool I2CPlugin::getState(JsonObject &params) {
//    params["state"] = state;
//    return true;
//}
