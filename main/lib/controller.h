#ifndef ESP_LIB_CONTROLLER_H
#define ESP_LIB_CONTROLLER_H

#include "ArduinoJson.h"

class Plugin;

class Controller_Notify_Handler {
  public:
    Controller_Notify_Handler() {};
    virtual uint8_t operator()(Plugin *p, uint8_t var_id, uint8_t val) = 0;
};


void notify(Plugin *p, uint8_t var_id, uint8_t val);
void update(uint8_t device_id, uint8_t var_id, uint8_t value);

int8_t findVarIdByName(Plugin *p, char *var_name);
int8_t findVarIdByName(int8_t device_id, char *var_name);

int8_t findDeviceIdByName(char *device_name);

void registerController(Controller_Notify_Handler *handler);
void unregisterController(Controller_Notify_Handler *handler);


#endif