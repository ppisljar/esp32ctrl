#include "c007_logging.h"

static const char *TAG = "LoggingPlugin";

PLUGIN_CONFIG(LoggingPlugin, t1_enabled, t2_enabled, t3_enabled, t4_enabled)
PLUGIN_STATS(LoggingPlugin, state, state)

class LoggingNotify : public Controller_Notify_Handler {
    private:
        char topic[64];
        char data[64];
        LoggingPlugin* p;
    public:
        LoggingNotify(LoggingPlugin* parent) {     
                p = parent;
        };
        uint8_t operator()(Plugin *x, uint8_t var_id, void *val, uint8_t val_type, bool shouldNotify) {
            if (!p->started) {
                return 0;
            }
            ESP_LOGD(TAG, "saving logs for device %d var %d ", p->id, var_id);
            time_t now;
            time(&now);

            if (ftell(p->f) == 0) fprintf(p->f, "timestamp, id, value\n");

            switch (val_type) {
                case 1: fprintf (p->f, "%ld,%d-%d,%d\n", now, x->id, var_id, *(uint8_t*)val); break;
                case 2: fprintf (p->f, "%ld,%d-%d,%i\n", now, x->id, var_id, *(uint16_t*)val); break;
                case 4: fprintf (p->f, "%ld,%d-%d,%i\n", now, x->id, var_id, *(uint32_t*)val); break;
                case 5: fprintf (p->f, "%ld,%d-%d,%f\n", now, x->id, var_id, *(float*)val); break;
                case 0: fprintf (p->f, "%ld,%d-%d,%s\n", now, x->id, var_id, (char*)val); break;
            }

            if (ftell(p->f) > 32*1024) rewind(p->f);
            
            fflush(p->f);

            return 0;
        }

        uint8_t operator()(Plugin *x, uint8_t var_id) {
            return 0;
        }
};

bool LoggingPlugin::start() {
    if (started) return true;
    bool sdcard = (*cfg)["sdcard"] | false;
    if (sdcard) {
        f = fopen("/sdcard/log.csv", "w");
        if (f == nullptr) { 
            ESP_LOGW(TAG, "can't open log file /sdcard/log.json");
            return false;
        }
        ESP_LOGI(TAG, "starting on sdcard");
    } else {
        f = fopen("/spiffs/log.csv", "w");
        if (f == nullptr) { 
            ESP_LOGW(TAG, "can't open log file /spiffs/log.json");
            return false;
        }

        ESP_LOGI(TAG, "starting on spiffs");
    }
    started = true;
    return true;
}

void LoggingPlugin::stop() {
    if (!started) return;
    started = false;
    fclose(f);
}

bool LoggingPlugin::init(JsonObject &params) {
    cfg = &((JsonObject &)params);
    state_cfg = &((JsonArray &)params["state"]);

    LoggingNotify *notify = new LoggingNotify(this);
    registerController(notify);

    return true;
}

