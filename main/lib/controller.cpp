#include "controller.h"
#include "config.h"

extern Config *cfg;
extern Plugin *active_plugins[10];

Controller_Notify_Handler *handlers[10];
uint last_id = 0;

void registerController(Controller_Notify_Handler* handler) {
    handlers[last_id++] = handler;
}

void notify(Plugin *p, uint8_t var_id, uint8_t val) {
    for (uint8_t i = 0; i < last_id; i++) {
        (*handlers[i])(p, var_id, val);
    }
}

void update(uint8_t device_id, uint8_t var_id, uint8_t val) {
    Plugin *p = active_plugins[device_id];
    p->setStatePtr(var_id, &val, false);
}

int8_t findDeviceIdByName(char *device_name) {
    if (device_name == nullptr) {
        return -1;
    }
    for (uint8_t i = 0; i < 10; i++) {
        if (active_plugins[i] == nullptr) break;
        char *name = (char*)active_plugins[i]->name;
        if (strcmp(name, device_name) == 0) {
            ESP_LOGI("CTRL", "found device with name %s : %i", device_name, i);
            return i;
        }
    }
    ESP_LOGI("CTRL", "didnt find device with name %s", device_name);
    return -1;
}

int8_t findVarIdByName(Plugin *p, char *var_name) {
    int8_t i = 0;
    if (var_name == nullptr) return -1;
    for (auto state_cfg : (*(p->state_cfg))) {
        if (strcmp(state_cfg["name"], var_name)) {
            ESP_LOGI("CTRL", "found variable with name %s : %i", var_name, i);
            return i;
        }
        i++;
    }
    ESP_LOGI("CTRL", "didnt find variable with name %s", var_name);
    return -1;
}

int8_t findVarIdByName(int8_t device_id, char *var_name) {
    if (device_id < 0) return -1;
    if (active_plugins[device_id]) {
        return findVarIdByName(active_plugins[device_id], var_name);
    }
    ESP_LOGI("CTRL", "didnt find variable with name %s", var_name);
    return -1;
}


// // plugin json
// {
//     name: 'test',
//     type: 1,
//     params: {
//         gpio: 23
//     },
//     state: [
//         { name: 'temperature', type: 'float', precision: 2, formula: 'x + 2'}
//     ]
// }