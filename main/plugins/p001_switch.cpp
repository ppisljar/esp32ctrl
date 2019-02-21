#include "p001_switch.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

const char *TAG = "SwitchPlugin";

void SwitchPlugin::task(void * pvParameters)
{
    SwitchPlugin* s = (SwitchPlugin*)pvParameters;

    ESP_LOGI(TAG, "main task: %i:%i", (unsigned)s, unsigned(pvParameters));
    for( ;; )
    {
        // Task code goes here.
        ESP_LOGI(TAG, "paramters: interval: %i, gpio: %i", s->interval, s->gpio);
        vTaskDelay(s->interval * 1000 / portTICK_PERIOD_MS);
    }
}

// 1. i think we want to avoid creating private variables to copy configuration state
//    - unless we want to only store it in plugins, which would have config file per plugin

/**
 * 2. state should behave differently: there is no initial state passed in, in init we can initialize it, get state should return the state and set state should allow updating it. memoty is allocated by plugin
 *    a. we pass in self describing object (json) and get out the same ... benefit: we don't need any additional schema
 * 
 * :: req1: plugin handles state
 * :: req2: we can set each variable independently
 */  

/**
 *  v2: each plugin tells how much memory it needs
 * - main task mallocs the memory and copies config into it (binary)
 * - init casts memory to struct and asigngs defaults
 * - getConfig returns memory pointer
 * - setConfig ? must write whole config, as we cannot have undefined members in struct
 * 
 * :: we dont need private variables ? as we use this memory directly
 */
// struct 001_config_struct {
//     int gpio;
//     int interval;
// }

// bool SwitchPlugin::init(void *memory) {
//     struct 0001_config_struct *cfg = (struct 0001_config_struct *)memory;
//     // how do we set defaults ? they need to be provided from web UI
//     //cfg->interval = 
// }

// // or we could receive in byte array, which won't allow us to set each setting independently
// // but its questionable which one is actually better for performance
// bool SwitchPlugin::setConfig(JsonObject &params) {
//     if (params.containsKey("gpio")) {
//         cfg->gpio = params["gpio"];
//     }
//     if (params.containsKey("interval")) {
//         cfg->interval = params["interval"];
//     }
//     return true;
// }

// // 
// JsonObject& SwitchPlugin::getConfig() {
//     JsonObject& obj = jb.createObject();
//     obj["interval"] = cfg->interval;
//     obj["gpio"] = cfg->gpio;
//     return obj;
// }

/**
 * v1: each plugin manages its own memory
 * - main task loads config? and passes it to plugin
 * - init copies config into its local state ? (private variables) .... could it work without this ?
 * - getConfig returns new object representing current config ... it could return just instance to main object if we could do above point
 * - setConfig sets local state from input object
 * 
 * :: if main doens't know anything (shouldnt) about plugins memory/config ... it passes {} down ... 0 memory ?
 *  ::: main task could alocate some big part of memory for config, and then expose API to create new objects (like the json thing)
 */

bool SwitchPlugin::init(JsonObject &params) {
    ESP_LOGI(TAG, "init");
    gpio = params["gpio"] | 255;
    interval = params["interval"] | 60;
    xTaskCreatePinnedToCore(this->task, TAG, 4096, this, 5, NULL, 1);
    return true;
}

bool SwitchPlugin::setConfig(JsonObject &params) {
    if (params.containsKey("gpio")) {
        gpio = params["gpio"];
    }
    if (params.containsKey("interval")) {
        interval = params["interval"];
    }
    return true;
}

bool SwitchPlugin::getConfig(JsonObject &params) {
    params["interval"] = interval;
    params["gpio"] = gpio;
    return true;
}

bool SwitchPlugin::setState(JsonObject &params) {
    if (params.containsKey("state")) {
        state = params["state"];
    }
    return true;
}

bool SwitchPlugin::getState(JsonObject &params) {
    params["state"] = state;
    return true;
}
