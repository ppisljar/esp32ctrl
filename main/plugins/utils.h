#ifndef ESP_PLUGIN_UTILS_H
#define ESP_PLUGIN_UTILS_H

#include "esp_log.h"
#include <string>
#include "plugin.h"

bool replace_string_in_place(std::string& subject, const std::string& search, const std::string& replace);
void parseStrForVar(std::string& str, Plugin *p, uint8_t var_id, uint8_t val);

#endif