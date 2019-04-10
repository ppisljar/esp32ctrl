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
        uint8_t operator()(Plugin *x, uint8_t var_id, void *val, uint8_t val_type) {
            ESP_LOGI(TAG, "saving logs for device %d var %d ", p->id, var_id);
            time_t now;
            time(&now);
            switch (val_type) {
                case 1: fprintf (p->f, "{\"timestamp\": %ld, \"device_id\": %d, \"var_id\": %d, \"value\": %d }\n", now, x->id, var_id, *(uint8_t*)val); break;
                case 2: fprintf (p->f, "{\"timestamp\": %ld, \"device_id\": %d, \"var_id\": %d, \"value\": %d }\n", now, x->id, var_id, *(uint16_t*)val); break;
                case 4: fprintf (p->f, "{\"timestamp\": %ld, \"device_id\": %d, \"var_id\": %d, \"value\": %d }\n", now, x->id, var_id, *(uint32_t*)val); break;
                case 5: fprintf (p->f, "{\"timestamp\": %ld, \"device_id\": %d, \"var_id\": %d, \"value\": %f }\n", now, x->id, var_id, *(float*)val); break;
                case 0: fprintf (p->f, "{\"timestamp\": %ld, \"device_id\": %d, \"var_id\": %d, \"value\": \"%s\" }\n", now, x->id, var_id, (char*)val); break;
            }
            
            return 0;
        }
};

bool LoggingPlugin::init(JsonObject &params) {
    cfg = &((JsonObject &)params);
    state_cfg = &((JsonArray &)params["state"]);

    f = fopen("/sdcard/log.json", "a");
    if (f == nullptr) { 
        ESP_LOGW(TAG, "can't open log file /sdcard/log/json");
        return false;
    }

    LoggingNotify *notify = new LoggingNotify(this);
    registerController(notify);

    return true;
}

