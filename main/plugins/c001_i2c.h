//#ifndef ESP_PLUGIN_c001_H
//#define ESP_PLUGIN_c001_H
//
//#include "plugin.h"
//#include "esp_log.h"
//#include "driver/i2c.h"
//#include "i2cdev.h"
//
//class I2CPlugin: public Plugin {
//    private:
//        bool state;
//        JsonObject *cfg;
//    public:
//        Plugin* clone() const {
//            return new I2CPlugin;
//        }
//
//        bool init(JsonObject &params);
//        bool setState(JsonObject &params);
//        bool setConfig(JsonObject &params);
//        bool getState(JsonObject& );
//        bool getConfig(JsonObject& );
//        static void task(void *pvParameters);
//};
//
//#endif