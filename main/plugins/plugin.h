#ifndef ESP_PLUGIN_SYS_H
#define ESP_PLUGIN_SYS_H

#include "ArduinoJson.h"

class Plugin
{
    public:
        virtual ~Plugin() {}
        virtual Plugin* clone() const = 0;

        virtual bool init(JsonObject &params) = 0;
        virtual bool setState(JsonObject &params) = 0;
        virtual bool setConfig(JsonObject &params) = 0;
        virtual JsonObject& getState() = 0;
        virtual JsonObject& getConfig() = 0;

        static Plugin* getPluginInstance(int type);
        static Plugin* addPrototype(int type, Plugin* p);
        static Plugin* protoTable[];
};

#define IMPLEMENT_CLONE(TYPE) Plugin* clone() const { return new TYPE(*this); }
#define MAKE_PROTOTYPE(ID, TYPE) Plugin* TYPE ## _myProtoype = Plugin::addPrototype(ID, new TYPE());

#endif