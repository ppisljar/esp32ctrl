#ifndef ESP_PLUGIN_025_H
#define ESP_PLUGIN_025_H


#include "plugin_defs.h"
#include "mqtt_client.h"
#include <functional>
#include <sstream>
#include <bits/stdc++.h> 

struct subscribe_info {
    std::regex re;
    char topic[48];
    int8_t device_id_group = -1;
    int8_t value_id_group = -1;
};

class HAMQTTPlugin: public Plugin {
    private:
        int value = 0;
        Type value_t = Type::integer;
        
    public:
        bool connected = false;

        esp_mqtt_client_config_t mqtt_cfg = {};
        esp_mqtt_client_handle_t client = {};
        std::map<char*,std::function<void(char*,char*)>> registeredTopics;
        struct subscribe_info info = {};

        DEFINE_PPLUGIN(HAMQTTPlugin, 25);

        void publish(char *topic, char* data);
        void subscribe(char *topic, std::function<void(char*,char*)> handler);
        void handler(char*, int, char*, int);
};

#endif