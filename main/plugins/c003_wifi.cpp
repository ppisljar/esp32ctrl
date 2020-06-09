#include "c003_wifi.h"
#include "../lib/global_state.h"
#include "../../components/network/DNSServer/DNSServer.h"
#include "mdns.h"
#include "../lib/config.h"

static const char *TAG = "WiFiPlugin";

extern uint8_t ledPin;
extern bool ledInverted;
extern Config* g_cfg;

PLUGIN_CONFIG(WiFiPlugin, mode, ssid, pass, ssid2, pass2, static_ip)
PLUGIN_STATS(WiFiPlugin, status.wifi_connected, status.wifi_connected)

DNSServer dnsServer;
static esp_err_t ap_mode(WiFiPlugin &p) {
    esp_wifi_stop();
    p.wifi_config = {};
    strcpy((char*)p.wifi_config.ap.ssid, "ESP32Ctrl");
    strcpy((char*)p.wifi_config.ap.password, "");
    p.wifi_config.ap.ssid_len = strlen((char*)p.wifi_config.ap.ssid);
    p.wifi_config.ap.max_connection = 5;
    p.wifi_config.ap.authmode = WIFI_AUTH_OPEN;
    ESP_ERROR_CHECK(esp_wifi_set_storage(WIFI_STORAGE_RAM));
    ESP_ERROR_CHECK(esp_wifi_set_mode(WIFI_MODE_APSTA));
    ESP_ERROR_CHECK(esp_wifi_set_config(ESP_IF_WIFI_AP, &p.wifi_config));
    esp_wifi_start();

    return ESP_OK;
}

static void initialise_mdns(void)
{
    JsonObject& c = g_cfg->getConfig();
    const char* hostname = c["unit"]["name"];
    if (hostname == nullptr || strcmp(hostname, "") == 0) {
        return;
    }
    //initialize mDNS
    ESP_ERROR_CHECK( mdns_init() );
    //set mDNS hostname (required if you want to advertise services)
    ESP_ERROR_CHECK( mdns_hostname_set(hostname) );
    ESP_LOGI(TAG, "mdns hostname set to: [%s]", hostname);
    //set default mDNS instance name
    ESP_ERROR_CHECK( mdns_instance_name_set("mdsn") );

    //structure with TXT records
    mdns_txt_item_t serviceTxtData[3] = {
        {"board","esp32"},
        {"u","user"},
        {"p","password"}
    };

    //initialize service
    ESP_ERROR_CHECK( mdns_service_add("ESP32Ctrl-WebServer", "_http", "_tcp", 80, serviceTxtData, 3) );
    //add another TXT item
    ESP_ERROR_CHECK( mdns_service_txt_item_set("_http", "_tcp", "path", "/foobar") );
    //change TXT item value
    ESP_ERROR_CHECK( mdns_service_txt_item_set("_http", "_tcp", "u", "admin") );
}

static esp_err_t event_handler(void *ctx, system_event_t *event)
{

    WiFiPlugin &p = *(WiFiPlugin*)ctx;
    JsonObject &params = *(p.cfg);
    uint8_t mode = params["mode"] | 1;
    switch(event->event_id) {
        case SYSTEM_EVENT_STA_START: {
            wifi_mode_t mode;
            esp_wifi_get_mode(&mode);
            ESP_LOGI(TAG, "SYSTEM_EVENT_STA_START");
            if (mode == WIFI_MODE_STA)
                ESP_ERROR_CHECK(esp_wifi_connect());   
            //dnsServer.stop();
            break;
        }
        case SYSTEM_EVENT_STA_STOP: {
            ESP_LOGI(TAG, "SYSTEM_EVENT_STA_STOP");
            break;
        }
         case SYSTEM_EVENT_AP_START:
            xTaskCreatePinnedToCore(p.task, TAG, 4096, &p, 5, NULL, 1);
             ESP_LOGI(TAG, "SoftAP started");
             break;
         case SYSTEM_EVENT_AP_STOP:
             ESP_LOGI(TAG, "SoftAP stopped");
             break;
         case SYSTEM_EVENT_AP_STACONNECTED:
             ESP_LOGI(TAG, "Station:"MACSTR" join, AID=%d",
                      MAC2STR(event->event_info.sta_connected.mac),
                      event->event_info.sta_connected.aid);
             break;
         case SYSTEM_EVENT_AP_STADISCONNECTED:
             ESP_LOGI(TAG, "Station:"MACSTR"leave, AID=%d",
                      MAC2STR(event->event_info.sta_disconnected.mac),
                      event->event_info.sta_disconnected.aid);
             break;
        case SYSTEM_EVENT_STA_GOT_IP:
            if (ledPin < 32) io.digitalWrite(ledPin, ledInverted ? 0 : 1);
            p.status.wifi_connected = true;
            global_state.wifi_connected = true;
            p.status.local_ip = ip4_addr_get_u32(&event->event_info.got_ip.ip_info.ip);
            esp_read_mac(p.status.mac, (esp_mac_type_t)0);
            ESP_LOGI(TAG, "SYSTEM_EVENT_STA_GOT_IP");
            ESP_LOGI(TAG, "Got IP: '%s'", ip4addr_ntoa(&event->event_info.got_ip.ip_info.ip));
            break;
        case SYSTEM_EVENT_STA_CONNECTED:
            //&event.event_info.sta_connected.
            ESP_LOGI(TAG, "WIFI STA CONNECTED");
            if (ledPin < 32) io.digitalWrite(ledPin, ledInverted ? 0 : 1);
            p.status.wifi_connected = true;
            global_state.wifi_connected = true;
            p.failed_1 = 0;
            break;
        case SYSTEM_EVENT_STA_DISCONNECTED:
            if (ledPin < 32) io.digitalWrite(ledPin, ledInverted ? 1 : 0);
            p.status.wifi_connected = false;
            global_state.wifi_connected = false;
            ESP_LOGI(TAG, "SYSTEM_EVENT_STA_DISCONNECTED");
			switch (event->event_info.disconnected.reason) {
			    case 4:
                    ESP_LOGI(TAG, "reason: ASSOC_EXIPIRE\n");
			        break;
                default:
                    ESP_LOGI(TAG, "reason: %d\n",event->event_info.disconnected.reason);
			}

            if (mode == 1) {
                ESP_LOGI(TAG, "setting wifi_storage to RAM");
                ESP_ERROR_CHECK(esp_wifi_disconnect());
                ESP_ERROR_CHECK(esp_wifi_stop());
                ESP_ERROR_CHECK(esp_wifi_set_storage(WIFI_STORAGE_RAM));
                ESP_ERROR_CHECK(esp_wifi_clear_fast_connect());
                ESP_ERROR_CHECK(esp_wifi_start());
                bool ssid1 = true; //strcmp((char*)wifi_config.sta.ssid, (char*)params["ssid1"].as<char*>()) == 0;
                if (ssid1) {
                    p.failed_1++;
                    if (p.failed_1 > 2) {
                        if (p.secondarySSID) {
                            ESP_LOGI(TAG, "switching to secondary ssid");
                            strcpy((char*)p.wifi_config.sta.ssid,  (char*)params["ssid2"].as<char*>());
                            strcpy((char*)p.wifi_config.sta.password, (char*)params["pass2"].as<char*>());
                            esp_wifi_set_config(ESP_IF_WIFI_STA, &p.wifi_config);
                        } else {
                            // allow to disable switching to AP mode ?
                            // or allow getting back from AP mode to normal mode when wifi is available agian
                            p.failed_1 = 0;

                            ESP_LOGI(TAG, "switching to ap mode");
                            params["mode"] = 0;
                            return ap_mode(p);
                        }
                    } else {
                        ESP_LOGI(TAG, "resetting wifi configuration");
                        strcpy((char*)p.wifi_config.sta.ssid, (char*)params["ssid"].as<char*>());
                        strcpy((char*)p.wifi_config.sta.password, (char*)params["pass"].as<char*>());
                        esp_wifi_set_config(ESP_IF_WIFI_STA, &p.wifi_config);
                    }
                } else {
                    p.failed_2++;
                    if (p.failed_2 > 2) {
                        if (p.failed_1 == 0) {
                            strcpy((char*)p.wifi_config.sta.ssid,  (char*)params["ssid2"].as<char*>());
                            strcpy((char*)p.wifi_config.sta.password, (char*)params["pass2"].as<char*>());
                            esp_wifi_set_config(ESP_IF_WIFI_STA, &p.wifi_config);
                        }  else {
                            params["mode"] = 0;
                            return ap_mode(p);
                        }
                    }
                }
            }
            ESP_LOGI(TAG, "reconnecting ...");
            ESP_ERROR_CHECK(esp_wifi_connect());
            break;
        default:
            ESP_LOGI(TAG, "SYSTEM_EVENT_WifI_%d", event->event_id);
            break;
    }
    return ESP_OK;
}

void WiFiPlugin::task(void * pvParameters)
{
    WiFiPlugin* s = (WiFiPlugin*)pvParameters;
    JsonObject &params = *(s->cfg);

    uint32_t delay = 60 * 60 * 1000 / portTICK_PERIOD_MS;
    vTaskDelay(delay);

    ESP_ERROR_CHECK(esp_wifi_stop());
    strcpy((char*)s->wifi_config.sta.ssid,  (char*)params["ssid2"].as<char*>());
    strcpy((char*)s->wifi_config.sta.password, (char*)params["pass2"].as<char*>());
    ESP_ERROR_CHECK(esp_wifi_set_mode(WIFI_MODE_STA));
    ESP_ERROR_CHECK(esp_wifi_set_config(ESP_IF_WIFI_STA, &s->wifi_config));
    ESP_ERROR_CHECK(esp_wifi_start());

    vTaskDelete(nullptr);

}

bool WiFiPlugin::init(JsonObject &params) {
    cfg = &params;   

    uint8_t mode = params["mode"] | 1; 
    char *ssid = (char*)params["ssid"].as<char*>();
    char *pass = (char*)params["pass"].as<char*>();

    if (ssid == nullptr || pass == nullptr) {
        ESP_LOGI(TAG, "starting wifi in AP mode");
        mode = 0;
    }
    else ESP_LOGI(TAG, "starting wifi in STA mode with %s:%s", ssid, pass);

    ESP_ERROR_CHECK(esp_event_loop_init(event_handler, this));

    // set static ip ?
    if (params.containsKey("static_ip") && params["static_ip"]["enabled"]) {
        ESP_LOGI(TAG, "setting static IP");
        tcpip_adapter_ip_info_t ip_info;
        ip_addr_t addr;
        
        addr.type = IPADDR_TYPE_V4;
        addr.u_addr.ip4.addr = htonl(params["static_ip"]["dns"]);
        dns_setserver(0, (const ip_addr_t *)&addr);

        int ret = tcpip_adapter_dhcpc_stop(TCPIP_ADAPTER_IF_STA);
        memset(&ip_info, 0, sizeof(ip_info));
        ip_info.ip.addr = params["static_ip"]["ip"];
        ip_info.gw.addr = params["static_ip"]["gw"];
        ip_info.netmask.addr = params["static_ip"]["netmask"];
        ret = tcpip_adapter_set_ip_info(TCPIP_ADAPTER_IF_STA, &ip_info);
    }

    wifi_init_config_t cfgw = WIFI_INIT_CONFIG_DEFAULT();
    ESP_ERROR_CHECK(esp_wifi_init(&cfgw));
    ESP_ERROR_CHECK(esp_wifi_set_storage(WIFI_STORAGE_FLASH));


    if (ESP_OK == esp_wifi_get_config(WIFI_IF_STA, &wifi_config) && wifi_config.sta.ssid[0] != 0) {
        ESP_ERROR_CHECK(esp_wifi_set_mode(WIFI_MODE_STA));
        ESP_LOGI(TAG, "Connect to stored Wi-Fi SSID:%s", wifi_config.sta.ssid);
    } 
    else {
        ESP_LOGW(TAG, "No wifi SSID stored!");
        
        if (mode == 0) { // AP
            ESP_ERROR_CHECK(esp_wifi_set_storage(WIFI_STORAGE_RAM));
            inet_pton(AF_INET, "192.168.4.1", &status.local_ip);
            dnsServer.start(53, "*", &status.local_ip);
            ssid = (char*)params["ap_ssid"].as<char*>();
            pass = (char*)params["ap_pass"].as<char*>();
            strcpy((char*)wifi_config.ap.ssid, ssid == nullptr ? "ESP32Ctrl" : ssid);
            strcpy((char*)wifi_config.ap.password, pass == nullptr ? "" : pass);
            wifi_config.ap.ssid_len = strlen((char*)wifi_config.ap.ssid);
            wifi_config.ap.max_connection = 5;
            wifi_config.ap.authmode = WIFI_AUTH_WPA_WPA2_PSK;
            
            if (strlen((char*)wifi_config.ap.password) == 0) {
                wifi_config.ap.authmode = WIFI_AUTH_OPEN;
            }
            ESP_ERROR_CHECK(esp_wifi_set_mode(WIFI_MODE_APSTA));
            ESP_ERROR_CHECK(esp_wifi_set_config(ESP_IF_WIFI_AP, &wifi_config));
        } else { // STA
            
            strcpy((char*)wifi_config.sta.ssid, ssid);
            strcpy((char*)wifi_config.sta.password, pass);
            secondarySSID = params["ssid2"].as<char*>() != nullptr && strlen(params["ssid2"].as<char*>()) > 0;

            ESP_ERROR_CHECK(esp_wifi_set_mode(WIFI_MODE_STA));
            ESP_ERROR_CHECK(esp_wifi_set_config(ESP_IF_WIFI_STA, &wifi_config));
        }
    }


    initialise_mdns();
    
    // in deep sleep mode we won't start wifi until needed
    if (mode != 2) {
        ESP_ERROR_CHECK(esp_wifi_start());
    }

    return true;
}

