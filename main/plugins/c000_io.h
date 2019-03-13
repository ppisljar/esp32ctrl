#ifndef ESP_PLUGIN_c000_H
      #define ESP_PLUGIN_c000_H

      #include "plugin.h"
      #include "freertos/FreeRTOS.h"
      #include "freertos/task.h"
      #include "esp_log.h"

      class IOlugin: public Plugin {
          private:
              bool state;
              JsonObject *cfg;
          public:
              Plugin* clone() const {
                  return new IOlugin;
              }

              bool init(JsonObject &params);
              bool setState(JsonObject &params);
              bool setConfig(JsonObject &params);
              bool getState(JsonObject& );
              bool getConfig(JsonObject& );
              void* getStatePtr(uint8_t );
              void setStatePtr(uint8_t, uint8_t*);
      };

      #endif