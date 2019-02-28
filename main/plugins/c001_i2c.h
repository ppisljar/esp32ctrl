#ifndef ESP_PLUGIN_c001_H
      #define ESP_PLUGIN_c001_H

      #include "plugin.h"
      #include "freertos/FreeRTOS.h"
      #include "freertos/task.h"
      #include "esp_log.h"
      #include "driver/i2c.h"

      #define ACK_CHECK_EN 0x1                        /*!< I2C master will check ack from slave*/
      #define ACK_CHECK_DIS 0x0                       /*!< I2C master will not check ack from slave */
      #define ACK_VAL 0x0                             /*!< I2C ack value */
      #define NACK_VAL 0x1                            /*!< I2C nack value */

      class I2CPlugin: public Plugin {
          private:
              bool state;
              JsonObject *cfg;
          public:
              Plugin* clone() const {
                  return new I2CPlugin;
              }

              bool init(JsonObject &params);
              bool setState(JsonObject &params);
              bool setConfig(JsonObject &params);
              bool getState(JsonObject& );
              bool getConfig(JsonObject& );
              void* getStatePtr(uint8_t );
              void setStatePtr(uint8_t, uint8_t*);
              esp_err_t read(uint8_t addr, uint8_t *data_rd, size_t size);
              esp_err_t write(uint8_t addr, uint8_t *data_wr, size_t size);
      };

      #endif