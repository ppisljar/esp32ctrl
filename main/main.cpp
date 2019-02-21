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

#include "lib/spiffs.cpp"
#include "lib/file_server.cpp"
#include "wifi.h"
#include "plugins/plugin.h"
#include "plugins/p001_switch.h"

// global config object
Config *cfg;
Plugin *active_plugins[10];

struct status {
    bool wifi_connected = false;
};

struct status status;

Plugin* SwitchPlugin_myProtoype = Plugin::addPrototype(1, new SwitchPlugin);

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

    // todo: start rule engine task
    
    // todo: init plugins
    
    JsonArray &plugins = cfgObject["plugins"];
    int pi = 0;
    for (auto plugin : plugins){
        ESP_LOGI(TAG, "initializing plugin type: %i", (int)plugin["type"]);
        active_plugins[pi] = Plugin::getPluginInstance((int)plugin["type"]);
        active_plugins[pi]->init(plugin);
        pi++;

    //     //struct plugin_definition *p = plugin_sys_get(plugin["type"]);
    //     //Plugin p = new p->plugin_class;
    //     // get the plugin class
    //     // create new instance
    //     // store it to the list of initialized plugins
    }
}

// when configuration is updated: (how to detect it ?) easiest way is to reboot ... web endpoint to save config (thru Config object), somewhere along the way we check what needs to be updated
// - reload config object ? 
// - if wifi config updated, reconnect (call initialize_wifi again)
// - stop all services and restart them
