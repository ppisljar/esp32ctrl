#include "plugin.h"
#include "esp_log.h"
Plugin* Plugin::protoTable[10];

Plugin* Plugin::getPluginInstance(int type)
{
    ESP_LOGI("PLUGIN", "loading plugin instance");
    Plugin* proto = protoTable[type];
    ESP_LOGI("PLUGIN", "found plugin instance");
    ESP_LOGI("PLUGIN", "calling clone 0x%08x", (unsigned)proto);
    return proto->clone();
}

Plugin* Plugin::addPrototype(int type, Plugin* p)
{
    ESP_LOGI("PLUGIN", "registering plugin %i on 0x%08x", type, (unsigned)p);
   protoTable[type] = p;
   return p;
}

