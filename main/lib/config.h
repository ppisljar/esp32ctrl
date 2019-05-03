#ifndef ESP_LIB_CONFIG_H
#define ESP_LIB_CONFIG_H

#include "spiffs.h"
#include "ArduinoJson.h"

#define config_filename "/spiffs/config.json"
#define config_default_json "{\"web\":{\"user\":\"admin\",\"pass\":\"admin\"},\"wifi\":{},\"plugins\":[]}"



class Config
{
    private:
        StaticJsonBuffer<50000> jsonBuffer;
        JsonObject *configuration;

    public:
        Config() {
            loadConfig();
        }
        void loadConfig() {
             ESP_LOGI("CONF", "loading config object");
            char* confData = read_file((char*)config_filename);
            if (confData == NULL) {
                ESP_LOGI("CONF", "warning: config file not found, creating new!");
                write_file((char*)config_filename, (char*)config_default_json, strlen(config_default_json));
                confData = read_file((char*)config_filename);
            }
            ESP_LOGI("CONF", "Parsing JSON object");
            JsonObject& ref = jsonBuffer.parseObject(confData);
            configuration = &ref;
        }
        JsonObject& getConfig() {
            return *configuration;
        }
        const char* getUnitName() {
            return (*configuration)["unit"]["name"].as<char*>();
        }

};

#endif
