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
    p->setStatePtr(var_id, &val);
}

int8_t findDeviceIdByName(char *device_name) {
    for (uint8_t i = 0; i < 10; i++) {
        char *name = (char*)active_plugins[i]->name;
        if (strcmp(name, device_name) == 0) {
            return i;
        }
    }
    return -1;
}

int8_t findVarIdByName(Plugin *p, char *var_name) {
    int8_t i = 0;
    for (auto state_cfg : (*(p->state_cfg))) {
        if (strcmp(state_cfg["name"], var_name)) {
            return i;
        }
        i++;
    }
    
    return -1;
}

int8_t findVarIdByName(int8_t device_id, char *var_name) {
    if (active_plugins[device_id]) {
        return findVarIdByName(active_plugins[device_id], var_name);
    }
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