#include "p014_dummy.h"

static const char *TAG = "DummyPlugin";

PLUGIN_CONFIG(DummyPlugin, value, value)

bool DummyPlugin::init(JsonObject &params) {
    cfg = &((JsonObject &)params["params"]);
    state_cfg = &((JsonArray &)params["state"]);

    JsonArray &vals = params["state"]["values"];

    values = new dummy_vals_t*[vals.size()];
    int i = 0;
    for (auto val : vals) {
        if (!val["name"]) values[i] = nullptr;   

        dummy_vals_t *value = (dummy_vals_t*)malloc(sizeof(dummy_vals_t));
        // value types: bool, int, double, float, string
        value->name = (char*)malloc(strlen(val["name"]) + 1);
        strcpy(value->name, val["name"].as<char*>());
        value->name[strlen(val["name"])] = 0;
        value->type = val["type"] | 0;
        value->value = malloc(1);

        values[i] = value;
    }

    return true;
}

bool DummyPlugin::getState(JsonObject &params) {
    for (int n = 0; n < 10; n++) {
        if (values[n] == nullptr || values[n]->name == nullptr) continue;
        params[values[n]->name] = *(uint8_t*)(values[n]->value);
    }
    return true;
}

bool DummyPlugin::setState(JsonObject &params) {
    for (int n = 0; n < 10; n++) {
        if (values[n] == nullptr || values[n]->name == nullptr) continue;
        *(uint8_t*)(values[n]->value) = params[values[n]->name];
    }
    return true;
}

void* DummyPlugin::getStatePtr(uint8_t n) {
    if (n > 10 || values[n] == nullptr) return nullptr;
    return values[n]->value;
}

void DummyPlugin::setStatePtr_(uint8_t n, uint8_t *val, bool shouldNotify) {
    if (n < 10 && values[n] != nullptr && values[n]->name != nullptr) {
        memcpy(values[n]->value, val, 1);
        if (shouldNotify) notify(this, n, *val);
    }
}