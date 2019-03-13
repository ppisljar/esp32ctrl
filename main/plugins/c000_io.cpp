#include "c001_i2c.h"

const char *C001_TAG = "IOlugin";

bool IOlugin::init(JsonObject &params) {
    cfg = &params;
    

    return true;
}

