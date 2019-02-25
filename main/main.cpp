/* HTTP File Server Example

   This example code is in the Public Domain (or CC0 licensed, at your option.)

   Unless required by applicable law or agreed to in writing, this
   software is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
   CONDITIONS OF ANY KIND, either express or implied.
*/

#include <sys/param.h>
#include "esp_event_loop.h"
#include "esp_log.h"
#include "esp_system.h"
#include "nvs_flash.h"

//#include "Arduino.h"

static const char *TAG = "example";

#include "lib/config.h"
#include "lib/spiffs.h"
#include "lib/file_server.h"
#include "wifi.h"
#include "plugins/plugin.h"
#include "plugins/p001_switch.h"
#include "plugins/p002_dht.h"
#include "plugins/p003_bmp280.h"
#include "plugins/p004_ds18x20.h"
#include "plugins/p005_regulator.h"
#include "plugins/p006_analog.h"

#include "lib/rule_engine.h"

// global config object
Config *cfg;
Plugin *active_plugins[10];

struct status {
    bool wifi_connected = false;
};

struct status status;

Plugin* SwitchPlugin_myProtoype = Plugin::addPrototype(1, new SwitchPlugin);
Plugin* DHTPlugin_myProtoype = Plugin::addPrototype(2, new DHTPlugin);
Plugin* BMP280Plugin_myProtoype = Plugin::addPrototype(3, new BMP280Plugin);
Plugin* DS18x20Plugin_myProtoype = Plugin::addPrototype(4, new DS18x20Plugin);
Plugin* RegulatorPlugin_myProtoype = Plugin::addPrototype(5, new RegulatorPlugin);
Plugin* AnalogPlugin_myProtoype = Plugin::addPrototype(6, new AnalogPlugin);

extern "C" void app_main()
{
    //initArduino();
    ESP_ERROR_CHECK(nvs_flash_init());
    tcpip_adapter_init();

    /* Initialize file storage */
    ESP_ERROR_CHECK(spiffs_init());

    /* Start the web server */
    ESP_ERROR_CHECK(start_file_server("/spiffs"));

    // load configuration
    cfg = new Config();
    JsonObject& cfgObject = cfg->getConfig();
    ESP_LOGI(TAG, "loaded configuration");

    // todo: pass secondary configuration 

    initialise_wifi(cfgObject["wifi"]["ssid"], cfgObject["wifi"]["pass"], &status);   

    // todo: initialize services

    JsonArray &plugins = cfgObject["plugins"];
    int pi = 0;
    for (auto plugin : plugins){
        ESP_LOGI(TAG, "initializing plugin type: %i", (int)plugin["type"]);
        active_plugins[pi] = Plugin::getPluginInstance((int)plugin["type"]);
        active_plugins[pi]->init(plugin);
        pi++;
    }

    long rule_length;
    uint8_t *rules = (uint8_t*)spiffs_read_file("/spiffs/rules.dat", &rule_length);
    if (rules != NULL && rule_length > 0) {
        ESP_LOGI(TAG, "parsing rule file of size: %ld", rule_length);
        parse_rules(rules, rule_length);
    }

    for(;;) {
        ESP_LOGD(TAG, "executing rule engine");
        run_rules();
        vTaskDelay( 1000 / portTICK_PERIOD_MS);
    }
}

// when configuration is updated: (how to detect it ?) easiest way is to reboot ... web endpoint to save config (thru Config object), somewhere along the way we check what needs to be updated
// - reload config object ? 
// - if wifi config updated, reconnect (call initialize_wifi again)
// - stop all services and restart them
