#ifndef ESP_PLUGIN_SYS_H
#define ESP_PLUGIN_SYS_H

#include "ArduinoJson.h"
#include "esp_log.h"
#include "esp_system.h"
#include "../lib/controller.h"
#include <map>

#define MAX_PLUGINS 50

enum Type : uint8_t { byte, integer, decimal, string };

// gets a pointer, type of variable at pointer, pointer to source and type of source
// template is used so we get correct destination pointer in (instead of void*) and
// type conversions (float to int) works correctly
template <typename T>
void convert(T ptr, Type to, void* val, Type from) {
    if (to < Type::string) {
        if (from == Type::string) {
            double d = atof((const char *)val);
            *ptr = d;
        } else if (from == Type::integer) {
            *ptr = *(int*)val;
        } else if (from == Type::decimal) {
            *ptr = *(float*)val;
        } else if (from == Type::byte) {
            *ptr = *(unsigned char*)val;
        } else {
            if (to == Type::byte) *ptr = *(unsigned char*)val;
            else if (to == Type::integer) *ptr = *(int*)val;
            else if (to == Type::decimal) *ptr = *(float*)val;
        }
    } else if (to == Type::string) {
        if (from == Type::string) {
            strcpy((char*)ptr, (const char*)val);   // this is a problem, we don't know the maximum size of destination string here
        } else if (from == Type::integer) {
            itoa(*(int*)val, (char*)ptr, 10);
        } else if (from == Type::decimal) {
            strcpy((char*)ptr, std::to_string(*(float*)val).c_str()); // this is a problem, we don't know the maximum size of dest string
            //dtostrf(*(float*)val, 10, 4, (char*)ptr);   
        } else if (from == Type::byte) {
            itoa(*(uint8_t*)val, (char*)ptr, 10);
        }
    } else {    // bytes, minimum 4, the actual number in type tells us the length
        if (from == Type::string) {
            strncpy((char*)ptr, (const char*)val, to);
        } else if (from > Type::string) {
            memcpy(ptr, val, to);
        } else if (from == Type::byte) {
            memcpy(ptr, val, 1);
        } else {
            memcpy(ptr, val, 4);
        }
    }
}

#define CONVERT_STATE(var, type, plugin, state) { \
    void* temp_convert_state_val; \
    Type temp_convert_state_type; \
    temp_convert_state_val = plugin->getStateVarPtr(state, &temp_convert_state_type); \
    convert(&var, type, temp_convert_state_val, temp_convert_state_type); \
}

#define SET_STATE(plugin, var, var_index, shouldNotify, value, value_type) plugin->var = value; \
    notify(plugin, var_index, &plugin->var, value_type, shouldNotify)

#define NOTIFY_CONTROLLER(shouldNotify, plugin, var, var_index, value_type) if (shouldNotify) notify(plugin, var_index, &plugin->var, value_type)


#define __CONCATENATE(arg1, arg2) __CONCATENATE2(arg1, arg2)
#define __CONCATENATE1(arg1, arg2) __CONCATENATE2(arg1, arg2)
#define __CONCATENATE2(arg1, arg2) arg1##arg2
#define INC(x) __CONCATENATE(INC_, x)
#define INC_0 1
#define INC_1 2
#define INC_2 3
#define INC_3 4
#define INC_4 5
#define INC_5 6
#define INC_6 7
#define INC_7 8
#define INC_8 9
#define INC_9 9

#define __FOREACH_MACRO_RECURSION_1(what, i, x, ...) what(x, i)
#define __FOREACH_MACRO_RECURSION_2(what, i, x, ...) what(x, i)__FOREACH_MACRO_RECURSION_1(what, INC(i), __VA_ARGS__)
#define __FOREACH_MACRO_RECURSION_3(what, i, x, ...) what(x, i)__FOREACH_MACRO_RECURSION_2(what, INC(i), __VA_ARGS__)
#define __FOREACH_MACRO_RECURSION_4(what, i, x, ...) what(x, i)__FOREACH_MACRO_RECURSION_3(what, INC(i), __VA_ARGS__)
#define __FOREACH_MACRO_RECURSION_5(what, i, x, ...) what(x, i)__FOREACH_MACRO_RECURSION_4(what, INC(i), __VA_ARGS__)
#define __FOREACH_MACRO_RECURSION_6(what, i, x, ...) what(x, i)__FOREACH_MACRO_RECURSION_5(what, INC(i), __VA_ARGS__)
#define __FOREACH_MACRO_RECURSION_7(what, i, x, ...) what(x, i)__FOREACH_MACRO_RECURSION_6(what, INC(i), __VA_ARGS__)
#define __FOREACH_MACRO_RECURSION_8(what, i, x, ...) what(x, i)__FOREACH_MACRO_RECURSION_7(what, INC(i), __VA_ARGS__)

#define __FOREACH_MACRO_RECURSION_NARG(...) __FOREACH_MACRO_RECURSION_NARG_(__VA_ARGS__, __FOREACH_MACRO_RECURSION_RSEQ_N())
#define __FOREACH_MACRO_RECURSION_NARG_(...) __FOREACH_MACRO_RECURSION_ARG_N(__VA_ARGS__)
#define __FOREACH_MACRO_RECURSION_ARG_N(_1, _2, _3, _4, _5, _6, _7, _8, N, ...) N
#define __FOREACH_MACRO_RECURSION_RSEQ_N() 8, 7, 6, 5, 4, 3, 2, 1, 0

#define __FOREACH_MACRO_RECURSION(N, what, x, ...) __CONCATENATE(__FOREACH_MACRO_RECURSION_, N)(what, 0, x, __VA_ARGS__)
#define FOREACH_MACRO(what, x, ...) __FOREACH_MACRO_RECURSION(__FOREACH_MACRO_RECURSION_NARG(x, __VA_ARGS__), what, x, __VA_ARGS__)

#define PP_NARG(...) PP_NARG_(__VA_ARGS__,PP_RSEQ_N())
#define PP_NARG_(...) PP_ARG_N(__VA_ARGS__)
#define PP_ARG_N( \
          _1, _2, _3, _4, _5, _6, _7, _8, _9,_10, \
         _11,_12,_13,_14,_15,_16,_17,_18,_19,_20, \
         _21,_22,_23,_24,_25,_26,_27,_28,_29,_30, \
         _31,_32,_33,_34,_35,_36,_37,_38,_39,_40, \
         _41,_42,_43,_44,_45,_46,_47,_48,_49,_50, \
         _51,_52,_53,_54,_55,_56,_57,_58,_59,_60, \
         _61,_62,_63,N,...) N
#define PP_RSEQ_N() \
         63,62,61,60,                   \
         59,58,57,56,55,54,53,52,51,50, \
         49,48,47,46,45,44,43,42,41,40, \
         39,38,37,36,35,34,33,32,31,30, \
         29,28,27,26,25,24,23,22,21,20, \
         19,18,17,16,15,14,13,12,11,10, \
         9,8,7,6,5,4,3,2,1,0

#define PLUGIN___CONFIG_1(VAR, I) if (params.containsKey(#VAR)) { ESP_LOGI("CFG", "setting var %s", #VAR); (*cfg)[#VAR] = params[#VAR]; }
#define PLUGIN___CONFIG_2(VAR, I) params[#VAR] = (*cfg)[#VAR];

#define PLUGIN_CONFIG(TYPE, ...) \
bool TYPE::setConfig(JsonObject &params) { \
    FOREACH_MACRO(PLUGIN___CONFIG_1, __VA_ARGS__) \
    return true; \
} \
bool TYPE::getConfig(JsonObject &params) { \
    FOREACH_MACRO(PLUGIN___CONFIG_2, __VA_ARGS__) \
    return true; \
}

#define PLUGIN___STATS_GET(VARIABLE, I) stateName = (char*)(*state_cfg)[I]["name"].as<char*>(); \
    params[stateName] = VARIABLE;
#define PLUGIN___STATS_SET(VARIABLE, I) stateName = (char*)(*state_cfg)[I]["name"].as<char*>(); \
    VARIABLE = params[stateName];
#define PLUGIN___STATS_GETPTR(VARIABLE, I) if (val == I) return &VARIABLE;
#define PLUGIN___STATS_SETPTR(VARIABLE, I) if (n == I) VARIABLE = *val;
#define PLUGIN___STATS_GETVARPTR(VARIABLE, I) if (n == I) { if (t != nullptr) *t = VARIABLE ## _t; return &VARIABLE; }
#define PLUGIN___STATS_SETVARPTR(VARIABLE, I) if (n == I) { \
  convert(&VARIABLE, VARIABLE ## _t, val, t); \
  notify(this, I, &VARIABLE, VARIABLE ## _t, shouldNotify); \
}
#define PLUGIN_STATS(TYPE, ...) \
bool TYPE::getState(JsonObject &params) { \
    char *stateName; \
    FOREACH_MACRO(PLUGIN___STATS_GET, __VA_ARGS__) \
    return true; \
} \
bool TYPE::setState(JsonObject &params) { \
    char *stateName; \
    FOREACH_MACRO(PLUGIN___STATS_SET, __VA_ARGS__) \
    return true; \
} \
void* TYPE::getStateVarPtr(int n, Type *t) { \
    FOREACH_MACRO(PLUGIN___STATS_GETVARPTR, __VA_ARGS__) \
    return NULL; \
} \
void TYPE::setStateVarPtr_(int n, void* val, Type t, bool shouldNotify) { \
    FOREACH_MACRO(PLUGIN___STATS_SETVARPTR, __VA_ARGS__) \
}

#define DEFINE_PLUGIN(TYPE) \
    Plugin* clone() const { \
        return new TYPE; \
    } \
    bool init(JsonObject &params); \
    bool setState(JsonObject &params); \
    bool setConfig(JsonObject &params); \
    bool getState(JsonObject& ); \
    bool getConfig(JsonObject& ); \
    void* getStateVarPtr(int, Type*); \
    void setStateVarPtr_(int, void*, Type, bool)

#define DEFINE_PPLUGIN(TYPE, TYPENR) \
    Plugin* clone() const { \
        return new TYPE; \
    } \
    bool init(JsonObject &params); \
    bool setState(JsonObject &params); \
    bool setConfig(JsonObject &params); \
    bool getState(JsonObject& ); \
    bool getConfig(JsonObject& ); \
    void* getStateVarPtr(int, Type*); \
    void setStateVarPtr_(int, void*, Type, bool); \
    ~TYPE(); \
    static const uint8_t p_type = TYPENR;


class Plugin
{
    public:
        virtual ~Plugin() {}
        virtual Plugin* clone() const = 0;

        virtual bool init(JsonObject &params) = 0;
        virtual bool setState(JsonObject &params) = 0;
        virtual bool setConfig(JsonObject &params) = 0;
        virtual bool getState(JsonObject& ) = 0;
        virtual bool getConfig(JsonObject& ) = 0;

        virtual void* getStateVarPtr(int, Type*) = 0;
        virtual void setStateVarPtr_(int, void*, Type, bool notify) = 0;
        void setStateVarPtr(int n, void* v, Type t, bool notify = true) {
            setStateVarPtr_(n, v, t, notify);
        }

        static bool hasType(int type);
        static Plugin* getPluginInstance(int type);
        static Plugin* addPrototype(int type, Plugin* p);
        static std::map<int, Plugin*> protoTable;

        JsonObject *cfg;
        JsonArray *state_cfg;

        const char* name;
        int id;
        uint8_t p_type;
};

#define IMPLEMENT_CLONE(TYPE) Plugin* clone() const { return new TYPE(*this); }
#define MAKE_PROTOTYPE(ID, TYPE) Plugin* TYPE ## _myProtoype = Plugin::addPrototype(ID, new TYPE());

#endif