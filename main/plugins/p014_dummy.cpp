#include "p014_dummy.h"

static const char *TAG = "DummyPlugin";

PLUGIN_CONFIG(DummyPlugin, value, value)

uint8_t type_size[4] = { 1, 2, 4, 24};
uint8_t type_map[6] = { 0, 1, 2, 3, 0};

bool DummyPlugin::init(JsonObject &params) {
    cfg = &((JsonObject &)params["params"]);
    state_cfg = &((JsonArray &)params["state"]);

    JsonArray &vals = params["state"]["values"];

    values = new dummy_vals_t*[vals.size()];
    values_len = vals.size();
    int i = 0;
    for (auto val : vals) {
        if (!val["name"]) values[i] = nullptr;   

        dummy_vals_t *value = (dummy_vals_t*)malloc(sizeof(dummy_vals_t));
        // value types: byte, integer, decimal, string
        value->name = (char*)malloc(strlen(val["name"]) + 1);
        strcpy(value->name, val["name"].as<char*>());
        value->name[strlen(val["name"])] = 0;
        value->type = val["type"] | 0;
        value->type = type_map[value->type];
        value->value = (uint8_t*)malloc(type_size[value->type]);
        *value->value = 0;

        ESP_LOGI(TAG, "adding dummy value %d with name %s and type %d", i, value->name, value->type);

        values[i] = value;
        i++;
    }

    return true;
}

bool DummyPlugin::getState(JsonObject &params) {
    for (int n = 0; n < values_len; n++) {
        if (values[n] == nullptr || values[n]->name == nullptr) continue;
        ESP_LOGI(TAG, "getting state %d with name %s and value %d", n, values[n]->name, *values[n]->value);
        params[values[n]->name] = *(uint8_t*)(values[n]->value);
    }
    return true;
}

bool DummyPlugin::setState(JsonObject &params) {
    for (int n = 0; n < values_len; n++) {
        if (values[n] == nullptr || values[n]->name == nullptr) continue;
        *(uint8_t*)(values[n]->value) = params[values[n]->name];
    }
    return true;
}

void* DummyPlugin::getStateVarPtr(int n, Type *t) { 
    if (n > values_len || values[n] == nullptr) return nullptr;
    if (t != nullptr) *t = (Type)values[n]->type; 
    return values[n]->value; 
} 

void DummyPlugin::setStateVarPtr_(int n, void* val, Type t, bool shouldNotify) {
    if (n < values_len && values[n] != nullptr && values[n]->name != nullptr) {
        convert(values[n]->value, (Type)values[n]->type, val, t);
        if (shouldNotify) notify(this, n, values[n]->value, values[n]->type); 
    }
}


DummyPlugin::~DummyPlugin() {
    
}
