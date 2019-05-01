#ifndef ESP_PLUGIN_014_H
#define ESP_PLUGIN_014_H

#include "plugin_defs.h"

struct dummy_vals_t {
    char *name;
    uint8_t type;
    uint8_t *value;
};

class DummyPlugin: public Plugin {
    private:
        int value = 0;
        dummy_vals_t **values;
        uint8_t values_len;
    public:

        DEFINE_PPLUGIN(DummyPlugin, 14);
        void setStatePtr_(uint8_t, uint8_t*, bool);
};

#endif