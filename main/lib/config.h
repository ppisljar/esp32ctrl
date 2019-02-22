#ifndef ESP_LIB_CONFIG_H
#define ESP_LIB_CONFIG_H

#include "spiffs.h"
#include "ArduinoJson.h"

const char* config_filename = "/spiffs/config.json";
const char* config_default_json = "{\"wifi\":{\"ssid\":\"Teltonika_Router\",\"pass\":\"secpass123\"},\"plugins\":[]}";

class Config
{
    private:
        StaticJsonBuffer<20000> jsonBuffer;
        JsonObject *configuration;

    public:
        Config() {
            loadConfig();
        }
        void loadConfig() {
             ESP_LOGI(TAG, "loading config object");
            char* confData = spiffs_read_file((char*)config_filename);
            if (confData == NULL) {
                ESP_LOGI(TAG, "warning: config file not found, creating new!");
                spiffs_write_file((char*)config_filename, (char*)config_default_json, strlen(config_default_json));
                confData = spiffs_read_file((char*)config_filename);
            }
            ESP_LOGI(TAG, "Parsing JSON object");
            JsonObject& ref = jsonBuffer.parseObject(confData);
            configuration = &ref;
        }
        JsonObject& getConfig() {
            return *configuration;
        }
};

#endif