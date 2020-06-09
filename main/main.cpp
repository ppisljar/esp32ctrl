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


#include "plugins/c003_wifi.h"

// global config object
Config *g_cfg;
Plugin *active_plugins[50];
WiFiPlugin *wifi_plugin;


#ifdef CONFIG_ENABLE_C001_I2C
#include "plugins/c001_i2c.h"
#endif

#ifdef CONFIG_ENABLE_C002_NTP
#include "plugins/c002_ntp.h"
NTPPlugin *ntp_plugin;
#endif

// #ifdef CONFIG_ENABLE_C003
// #endif

//#ifdef CONFIG_ENABLE_C004_TIMERS
#include "plugins/c004_timers.h"
TimersPlugin *timers_plugin;
//#endif

#ifdef CONFIG_ENABLE_C005_HUE
#include "plugins/c005_hue.h"
HueEmulatorPlugin *hue_plugin;
#endif

#ifdef CONFIG_ENABLE_C006
#include "plugins/c006_touch.h"
TouchPlugin *touch_plugin;
#endif

#ifdef CONFIG_ENABLE_C007
#include "plugins/c007_logging.h"
LoggingPlugin *logging_plugin;
#endif

//#ifdef ENABLE_C008
#include "plugins/c008_cron.h"
CronPlugin *cron_plugin;
//#endif

#ifdef CONFIG_ENABLE_C009
#include "bluetooth.h"
#include "plugins/c009_bluetooth.h"
BlueToothPlugin *bluetooth_plugin;
BlueTooth* bluetooth;
#endif

#ifdef CONFIG_LVGL_GUI_ENABLE
#include "plugins/c010_lcd.h"
LcdPlugin *lcd_plugin;
#endif

IO io;

#ifdef CONFIG_ENABLE_P001_SWITCH 
#include "plugins/p001_switch.h"
Plugin* SwitchPlugin_myProtoype = Plugin::addPrototype(SwitchPlugin::p_type, new SwitchPlugin);
#endif
#ifdef CONFIG_ENABLE_P002_DHT 
#include "plugins/p002_dht.h"
Plugin* DHTPlugin_myProtoype = Plugin::addPrototype(2, new DHTPlugin);
#endif
#ifdef CONFIG_ENABLE_P003_BMP 
#include "plugins/p003_bmp280.h"
Plugin* BMP280Plugin_myProtoype = Plugin::addPrototype(3, new BMP280Plugin);
#endif
#ifdef CONFIG_ENABLE_P004_DS18x20
#include "plugins/p004_ds18x20.h"
Plugin* DS18x20Plugin_myProtoype = Plugin::addPrototype(4, new DS18x20Plugin);
#endif
#ifdef CONFIG_ENABLE_P005_REGULATOR
#include "plugins/p005_regulator.h"
Plugin* RegulatorPlugin_myProtoype = Plugin::addPrototype(5, new RegulatorPlugin);
#endif
#ifdef CONFIG_ENABLE_P006_ANALOG 
#include "plugins/p006_analog.h"
Plugin* AnalogPlugin_myProtoype = Plugin::addPrototype(6, new AnalogPlugin);
#endif
#ifdef CONFIG_ENABLE_P007_ADS1115 
#include "plugins/p007_ads111x.h"
Plugin* ADS111xPlugin_myProtoype = Plugin::addPrototype(7, new ADS111xPlugin);
#endif
#ifdef CONFIG_ENABLE_P008_MCP23017
#include "plugins/p008_mcp23017.h"
Plugin* MCP23017Plugin_myProtoype = Plugin::addPrototype(8, new MCP23017Plugin);
#endif
#ifdef CONFIG_ENABLE_P009_PCF8574
#include "plugins/p009_pcf8574.h"
Plugin* PCF8574Plugin_myProtoype = Plugin::addPrototype(9, new PCF8574Plugin);
#endif
#ifdef CONFIG_ENABLE_P010_PCA9685
#include "plugins/p010_pca9685.h"
Plugin* PCA9685Plugin_myProtoype = Plugin::addPrototype(10, new PCA9685Plugin);
#endif
#ifdef CONFIG_ENABLE_P011_MQTT
#include "plugins/p011_mqtt.h"
Plugin* MQTTPlugin_myProtoype = Plugin::addPrototype(11, new MQTTPlugin);
#endif
#ifdef CONFIG_ENABLE_P012_ROTARY 
#include "plugins/p012_rotary_encoder.h"
Plugin* RotaryEncoderPlugin_myProtoype = Plugin::addPrototype(12, new RotaryEncoderPlugin);
#endif
#ifdef CONFIG_ENABLE_P013_HTTP 
#include "plugins/p013_http_ctrl.h"
Plugin* HTTPCtrlPlugin_myProtoype = Plugin::addPrototype(13, new HTTPCtrlPlugin);
#endif
#ifdef CONFIG_ENABLE_P014_DUMMY
#include "plugins/p014_dummy.h"
Plugin* DummyPlugin_myProtoype = Plugin::addPrototype(14, new DummyPlugin);
#endif
#ifdef CONFIG_ENABLE_P015_DIMMER
#include "plugins/p015_dimmer.h"
Plugin* DimmerPlugin_myProtoype = Plugin::addPrototype(15, new DimmerPlugin);
#endif
#ifdef CONFIG_ENABLE_P016_UDPSERVER
#include "plugins/p016_udp_server.h"
Plugin* UdpServerPlugin_myProtoype = Plugin::addPrototype(16, new UdpServerPlugin);
#endif
#ifdef CONFIG_ENABLE_P017
#include "plugins/p017_vml6040.h"
Plugin* VEML6040Plugin_myProtoype = Plugin::addPrototype(17, new VEML6040Plugin);
#endif
#ifdef CONFIG_ENABLE_P018
#include "plugins/p018_digital_input.h"
Plugin* DigitalInputPlugin_myProtoype = Plugin::addPrototype(18, new DigitalInputPlugin);
#endif
#ifdef CONFIG_ENABLE_P019
#include "plugins/p019_pwm_output.h"
Plugin* PWMOutputPlugin_myProtoype = Plugin::addPrototype(19, new PWMOutputPlugin);
#endif
#ifdef CONFIG_ENABLE_P020
#include "plugins/p020_max31855.h"
Plugin* Max31855Plugin_myProtoype = Plugin::addPrototype(20, new Max31855Plugin);
#endif
#ifdef CONFIG_ENABLE_P021
#include "plugins/p021_mlx90614.h"
Plugin* Mlx90614Plugin_myProtoype = Plugin::addPrototype(21, new Mlx90614Plugin);
#endif
#ifdef CONFIG_ENABLE_P022
#include "plugins/p022_pid_regulator.h"
Plugin* PIDRegulatorPlugin_myProtoype = Plugin::addPrototype(22, new PIDRegulatorPlugin);
#endif
#ifdef CONFIG_ENABLE_P023
#include "plugins/p023_motor_driver.h"
Plugin* MotorDriverPlugin_myProtoype = Plugin::addPrototype(23, new MotorDriverPlugin);
#endif

uint8_t ledPin;
bool ledInverted;

struct global_state_t global_state;

void btfunc(uint16_t packet_id, void* devices, uint16_t len) {
    ESP_LOGI(TAG, "bluetooth done");
}

void init_plugins() {
    JsonObject& cfgObject = g_cfg->getConfig();
    JsonArray &plugins = cfgObject["plugins"];
    for (auto plugin : plugins){
        if (!plugin["enabled"]) continue;
        uint8_t pid = plugin["id"];
        ESP_LOGI(TAG, "initializing plugin '%s' type: %i id:%i", plugin["name"].as<char*>(), (int)plugin["type"], pid);
        if (!Plugin::hasType((int)plugin["type"])) {
            ESP_LOGI(TAG, "invalid plugin type, skipping ...");
            continue;
        }
        active_plugins[pid] = Plugin::getPluginInstance((int)plugin["type"]);
        active_plugins[pid]->name = plugin["name"].as<char*>();
        active_plugins[pid]->id = pid;
        active_plugins[pid]->init(plugin);
    }
}

void deinit_plugins() {
    for (int i = 0; i < 50; i++) {
        if (active_plugins[i] != nullptr) {
            free(active_plugins[i]);
        }
    }
}

extern "C" void app_main()
{
    esp_log_level_set("*", (esp_log_level_t)3); // by default assume info error level
    //initArduino();
    //nvs_flash_erase();
    ESP_ERROR_CHECK(nvs_flash_init());
    tcpip_adapter_init();

    /* Initialize file storage */
    ESP_ERROR_CHECK(spiffs_init());

    struct IO_DIGITAL_PINS pins;
    pins.set_direction = new ESP_set_direction();
    pins.digital_read = new ESP_digital_read();
    pins.digital_write = new ESP_digital_write();
    pins.analog_read = new ESP_analog_read();
    io.addDigitalPins(40, &pins);



    // load configuration
    g_cfg = new Config();
    JsonObject& cfgObject = g_cfg->getConfig();
    ESP_LOGI(TAG, "loaded configuration");

    uint8_t resetPin = cfgObject["hardware"]["reset"]["pin"] | 255;
    ledPin = cfgObject["hardware"]["led"]["gpio"] | 255;
    ledInverted = cfgObject["hardware"]["led"]["inverted"] | false;

    JsonObject &wifi_config = cfgObject["wifi"];
    wifi_plugin = new WiFiPlugin();
    wifi_plugin->init(wifi_config);

    /* Start the web server */
    ESP_ERROR_CHECK(start_file_server("/spiffs"));

    if (cfgObject["hardware"]["spi"]["enabled"]) {
        JsonObject &spi_config = cfgObject["hardware"]["spi"];
        if (cfgObject["hardware"]["sdcard"]["enabled"]) {
            if (sdcard_init(spi_config) == ESP_OK) {
                global_state.sdcard_connected = true;
            }
        }
    }

    #ifdef CONFIG_ENABLE_C004_TIMERS
    JsonObject &timer_config = cfgObject["hardware"];
    timers_plugin = new TimersPlugin();
    timers_plugin->init(timer_config);
    #endif

    #ifdef CONFIG_ENABLE_C009
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
    #endif

    #ifdef CONFIG_ENABLE_C006
    ESP_LOGI(TAG, "starting touch");
    touch_plugin = new TouchPlugin();
    touch_plugin->init(cfgObject);
    #endif

    #ifdef CONFIG_ENABLE_C001_I2C
    if (cfgObject["hardware"]["i2c"]["enabled"]) {
        ESP_LOGI(TAG, "i2c init");
        JsonObject &i2c_conf = cfgObject["hardware"]["i2c"];
        i2c_plugin = new I2CPlugin();
        bool i2cerr = i2c_plugin->init(i2c_conf);
        if (i2cerr != true) {
            ESP_LOGE(TAG, "i2c init: error");
        };
    }
    #endif

    #ifdef CONFIG_ENABLE_C002_NTP
    if (cfgObject["ntp"]["enabled"]) {
        JsonObject &ntp_conf = cfgObject["ntp"];
        ntp_plugin = new NTPPlugin();
        ntp_plugin->init(ntp_conf);
    }
    #endif

    #ifdef CONFIG_ENABLE_C005_HUE
    if (cfgObject["alexa"]["enabled"]) {
        JsonObject &hue_conf = cfgObject["alexa"];
        hue_plugin = new HueEmulatorPlugin();
        hue_plugin->init(hue_conf);
    }
    #endif

    #ifdef CONFIG_LVGL_GUI_ENABLE
    if (cfgObject["lcd"]["enabled"]) {
        JsonObject &lcd_config = cfgObject["lcd"];
        lcd_plugin = new LcdPlugin();
        lcd_plugin->init(lcd_config);
    }
    #endif

    init_plugins();
    init_rules();
    

    http_server_ready();

    #ifdef CONFIG_ENABLE_C007
    init_logging();
    logging_plugin = new LoggingPlugin();
    logging_plugin->init(cfgObject);
    logging_plugin->start();
    #endif

    fire_system_event(1024, 0, nullptr);

    ESP_LOGI(TAG, "done loading plugins, free heap: %i", xPortGetFreeHeapSize());
    for(;;) {
        // if (resetPin < 32 && gpio_get_level((gpio_num_t)resetPin) == 0) {
        //     ESP_LOGI(TAG, "reset button pressed");
        //     esp_restart();
        // }
        ESP_LOGD(TAG, "executing rule engine");
        run_rules();
        vTaskDelay( 1000 / portTICK_PERIOD_MS);
    }
}

// when configuration is updated: (how to detect it ?) easiest way is to reboot ... web endpoint to save config (thru Config object), somewhere along the way we check what needs to be updated
// - reload config object ? 
// - if wifi config updated, reconnect (call initialize_wifi again)
// - stop all services and restart them
