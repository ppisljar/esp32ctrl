#include "c002_ntp.h"

const char *C002_TAG = "NTPPlugin";

PLUGIN_CONFIG(NTPPlugin, interval, host, timezone, always)
PLUGIN_STATS(NTPPlugin, current_time, current_time)

void NTPPlugin::getTime(const char* host) {
    ESP_LOGI(C002_TAG, "setting snmp to %s", host);
    sntp_setoperatingmode(SNTP_OPMODE_POLL);
    sntp_setservername(0, (char*)host);
    sntp_init();

    time_t now = 0;
    struct tm timeinfo = { 0 };
    int retry = 0;
    const int retry_count = 10;
    while(timeinfo.tm_year < (2016 - 1900) && ++retry < retry_count) {
        ESP_LOGI(C002_TAG, "Waiting for system time to be set... (%d/%d)", retry, retry_count);
        vTaskDelay(2000 / portTICK_PERIOD_MS);
        time(&now);

        localtime_r(&now, &timeinfo);
    }

    // TODO: if it fails try again later

    if (timeinfo.tm_year > (2016 - 1900)) {
        char strftime_buf[64];
        strftime(strftime_buf, sizeof(strftime_buf), "%c", &timeinfo);
        ESP_LOGI(C002_TAG, "Time is set, current date/time is: %s", strftime_buf);
        hasTime = true;
    }
}

bool NTPPlugin::init(JsonObject &params) {
    cfg = &params;   

    if (!params.containsKey("host")) {
        params.set("host", "pool.ntp.org");
    }
    if (!params.containsKey("timezone")) {
        params.set("timezone", "CET-1CEST,M3.5.0/2,M10.5.0/3");
    }
    if (!params.containsKey("always")) {
        params.set("always", true);
    }

    bool always = params["always"] | true;
    const char *host = "pool.ntp.org";
    time_t now;
    struct tm timeinfo;
    time(&now);
    setenv("TZ", params["timezone"].as<char*>(), 1);
    tzset();
    localtime_r(&now, &timeinfo);

    // we need to wait for wifi (or make ip readable directly from wifi)
    int retry = 0; int retry_count = 5;
    while(wifi_plugin->status.local_ip == 0) {
        ESP_LOGI(C002_TAG, "Waiting for wifi ... (%d/%d)", retry++, retry_count);
        vTaskDelay(2000 / portTICK_PERIOD_MS);
    }

    // TODO: if wifi is not available on boot, or we can't reach ntp server on boot we should try to recover at a later time
    if (wifi_plugin->status.local_ip == 0) {
        ESP_LOGI(C002_TAG, "setting soft timer to retry after 1 hour");
        soft_timer([=](){
            getTime(host);
        }, 60 * 60 * 1000, false);
    } else {
        getTime(host);
    }

    return true;
}

