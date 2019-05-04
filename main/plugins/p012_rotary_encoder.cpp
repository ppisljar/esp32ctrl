#include "p012_rotary_encoder.h"

static const char *TAG = "RotaryEncoderPlugin";

PLUGIN_CONFIG(RotaryEncoderPlugin, interval, gpio1, gpio2, type)
PLUGIN_STATS(RotaryEncoderPlugin, value, value)

bool RotaryEncoderPlugin::init(JsonObject &params) {
    cfg = &((JsonObject &)params["params"]);
    state_cfg = &((JsonArray &)params["state"]);


    return true;
}

RotaryEncoderPlugin::~RotaryEncoderPlugin() {
    
}
