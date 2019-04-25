#include <sys/param.h>
#include "esp_event_loop.h"
#include "esp_log.h"
#include "esp_system.h"
#include "nvs_flash.h"

//#include "Arduino.h"

static const char *TAG = "MAIN";

#include "lib/config.h"
#include "lib/spiffs.h"
#include "lib/file_server.h"
#include "lib/rule_engine.h"
#include "lib/logging.h"
#include "lib/io.h"
#include "lib/global_state.h"
#include "plugins/plugin.h"
#include "plugins/c001_i2c.h"
#include "plugins/c002_ntp.h"
#include "plugins/c003_wifi.h"
#include "plugins/c004_timers.h"
#include "plugins/c005_hue.h"
#include "plugins/c006_touch.h"
#include "plugins/c007_logging.h"
#include "plugins/c008_cron.h"

#include "plugins/p001_switch.h"
#include "plugins/p002_dht.h"
#include "plugins/p003_bmp280.h"
#include "plugins/p004_ds18x20.h"
#include "plugins/p005_regulator.h"
#include "plugins/p006_analog.h"
#include "plugins/p007_ads111x.h"
#include "plugins/p008_mcp23017.h"
#include "plugins/p009_pcf8574.h"
#include "plugins/p010_pca9685.h"
#include "plugins/p011_mqtt.h"
#include "plugins/p012_rotary_encoder.h"
#include "plugins/p013_http_ctrl.h"
#include "plugins/p014_dummy.h"
#include "plugins/p015_dimmer.h"

#include "bluetooth.h"
#include "plugins/c009_bluetooth.h"


// global config object
Config *cfg;
Plugin *active_plugins[10];
I2CPlugin *i2c_plugin;
NTPPlugin *ntp_plugin;
WiFiPlugin *wifi_plugin;
TimersPlugin *timers_plugin;
HueEmulatorPlugin *hue_plugin;
TouchPlugin *touch_plugin;
LoggingPlugin *logging_plugin;
CronPlugin *cron_plugin;
BlueToothPlugin *bluetooth_plugin;

IO io;

#ifdef CONFIG_ENABLE_P001_SWITCH 
Plugin* SwitchPlugin_myProtoype = Plugin::addPrototype(1, new SwitchPlugin);
#endif
#ifdef CONFIG_ENABLE_P002_DHT 
Plugin* DHTPlugin_myProtoype = Plugin::addPrototype(2, new DHTPlugin);
#endif
#ifdef CONFIG_ENABLE_P003_BMP 
Plugin* BMP280Plugin_myProtoype = Plugin::addPrototype(3, new BMP280Plugin);
#endif
#ifdef CONFIG_ENABLE_P004_DS18x20
Plugin* DS18x20Plugin_myProtoype = Plugin::addPrototype(4, new DS18x20Plugin);
#endif
#ifdef CONFIG_ENABLE_P005_REGULATOR
Plugin* RegulatorPlugin_myProtoype = Plugin::addPrototype(5, new RegulatorPlugin);
#endif
#ifdef CONFIG_ENABLE_P006_ANALOG 
Plugin* AnalogPlugin_myProtoype = Plugin::addPrototype(6, new AnalogPlugin);
#endif
#ifdef CONFIG_ENABLE_P007_ADS1115 
Plugin* ADS111xPlugin_myProtoype = Plugin::addPrototype(7, new ADS111xPlugin);
#endif
#ifdef CONFIG_ENABLE_P008_MCP23017
Plugin* MCP23017Plugin_myProtoype = Plugin::addPrototype(8, new MCP23017Plugin);
#endif
#ifdef CONFIG_ENABLE_P009_PCF8574
Plugin* PCF8574Plugin_myProtoype = Plugin::addPrototype(9, new PCF8574Plugin);
#endif
#ifdef CONFIG_ENABLE_P010_PCA9685
Plugin* PCA9685Plugin_myProtoype = Plugin::addPrototype(10, new PCA9685Plugin);
#endif
#ifdef CONFIG_ENABLE_P011_MQTT
Plugin* MQTTPlugin_myProtoype = Plugin::addPrototype(11, new MQTTPlugin);
#endif
#ifdef CONFIG_ENABLE_P012_ROTARY 
Plugin* RotaryEncoderPlugin_myProtoype = Plugin::addPrototype(12, new RotaryEncoderPlugin);
#endif
#ifdef CONFIG_ENABLE_P013_HTTP 
Plugin* HTTPCtrlPlugin_myProtoype = Plugin::addPrototype(13, new HTTPCtrlPlugin);
#endif
#ifdef CONFIG_ENABLE_P014_DUMMY
Plugin* DummyPlugin_myProtoype = Plugin::addPrototype(14, new DummyPlugin);
#endif
#ifdef CONFIG_ENABLE_P015_DIMMER
Plugin* DimmerPlugin_myProtoype = Plugin::addPrototype(15, new DimmerPlugin);
#endif

BlueTooth* bluetooth;

uint8_t ledPin;
bool ledInverted;

struct global_state_t global_state;

void btfunc(uint16_t packet_id, void* devices, uint16_t len) {
    ESP_LOGI(TAG, "bluetooth done");
}

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

    uint8_t resetPin = cfgObject["hardware"]["reset"]["pin"] | 255;
    ledPin = cfgObject["hardware"]["led"]["gpio"] | 255;
    ledInverted = cfgObject["hardware"]["led"]["inverted"] | false;

    if (cfgObject["hardware"]["spi"]["enabled"]) {
        JsonObject &spi_config = cfgObject["hardware"]["spi"];
        if (cfgObject["hardware"]["sdcard"]["enabled"]) {
            if (sdcard_init(spi_config) == ESP_OK) {
                global_state.sdcard_connected = true;
            }
        }
    }

    JsonObject &wifi_config = cfgObject["wifi"];
    wifi_plugin = new WiFiPlugin();
    wifi_plugin->init(wifi_config);

    JsonObject &timer_config = cfgObject["hardware"];
    timers_plugin = new TimersPlugin();
    timers_plugin->init(timer_config);

    JsonObject &bluetooth_config = cfgObject["bluetooth"];
    if (bluetooth_config["enabled"]) {
        if (bluetooth_config["server"]["enabled"]) {
            bluetooth_plugin = new BlueToothPlugin();
            bluetooth_plugin->init(bluetooth_config);
        }
        // bluetooth = new BlueTooth();
        // bluetooth->init();
        // bluetooth->getDevices(btfunc, 0);
    }

    //JsonObject &io_cfg = cfgObject["io"];
    struct IO_DIGITAL_PINS pins;
    pins.set_direction = new ESP_set_direction();
    pins.digital_read = new ESP_digital_read();
    pins.digital_write = new ESP_digital_write();
    pins.analog_read = new ESP_analog_read();
    io.addDigitalPins(40, &pins);

    touch_plugin = new TouchPlugin();
    touch_plugin->init(cfgObject);

    if (cfgObject["hardware"]["i2c"]["enabled"]) {
        JsonObject &i2c_conf = cfgObject["hardware"]["i2c"];
        i2c_plugin = new I2CPlugin();
        int i2cerr = i2c_plugin->init(i2c_conf);
        if (i2cerr != ESP_OK) {
            ESP_LOGE(TAG, "i2c init: error %x", i2cerr);
        };
    }

    if (cfgObject["ntp"]["enabled"]) {
        JsonObject &ntp_conf = cfgObject["ntp"];
        ntp_plugin = new NTPPlugin();
        ntp_plugin->init(ntp_conf);
    }

    if (cfgObject["alexa"]["enabled"]) {
        JsonObject &hue_conf = cfgObject["alexa"];
        hue_plugin = new HueEmulatorPlugin();
        hue_plugin->init(hue_conf);
    }

    vTaskDelay( 2000 / portTICK_PERIOD_MS);

    JsonArray &plugins = cfgObject["plugins"];
    for (auto plugin : plugins){
        if (!plugin["enabled"]) continue;
        uint8_t pid = plugin["id"];
        ESP_LOGI(TAG, "initializing plugin '%s' type: %i", plugin["name"].as<char*>(), (int)plugin["type"]);
        if (!Plugin::hasType((int)plugin["type"])) {
            ESP_LOGI(TAG, "invalid plugin type, skipping ...");
            continue;
        }
        active_plugins[pid] = Plugin::getPluginInstance((int)plugin["type"]);
        active_plugins[pid]->name = plugin["name"].as<char*>();
        active_plugins[pid]->id = pid;
        active_plugins[pid]->init(plugin);
        vTaskDelay( 1000 / portTICK_PERIOD_MS);
    }

    long rule_length;
    uint8_t *rules = (uint8_t*)read_file("/spiffs/rules.dat", &rule_length);
    if (rules != NULL && rule_length > 0) {
        ESP_LOGI(TAG, "parsing rule file of size: %ld", rule_length);
        parse_rules(rules, rule_length);
    }

    http_server_ready();
    init_logging();

    fire_system_event(1024, 0, nullptr);

    //i2c_plugin->scan();

    for(;;) {
        // if (resetPin < 32 && gpio_get_level((gpio_num_t)resetPin) == 0) {
        //     ESP_LOGI(TAG, "reset button pressed");
        //     esp_restart();
        // }
        ESP_LOGD(TAG, "executing rule engine");
        run_rules();
        vTaskDelay( 100 / portTICK_PERIOD_MS);
    }
}

// when configuration is updated: (how to detect it ?) easiest way is to reboot ... web endpoint to save config (thru Config object), somewhere along the way we check what needs to be updated
// - reload config object ? 
// - if wifi config updated, reconnect (call initialize_wifi again)
// - stop all services and restart them
