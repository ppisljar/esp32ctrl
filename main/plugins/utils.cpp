#include "utils.h"

bool replace_string_in_place(std::string& subject, const std::string& search, const std::string& replace) {
    size_t pos = 0;
    bool success = false;
    while((pos = subject.find(search, pos)) != std::string::npos) {
         subject.replace(pos, search.length(), replace);
         pos += replace.length();
         success = true;
    }
    return success;
}

void parseStrForVar(std::string& str, Plugin *p, uint8_t var_id, uint8_t val) {
    std::string name(p->name);
    replace_string_in_place(str, "%device_id%", std::to_string(p->id));
    replace_string_in_place(str, "%device_name%", name);
    replace_string_in_place(str, "%value_id%", std::to_string(var_id));
    replace_string_in_place(str, "%value_name%", "test");
    replace_string_in_place(str, "%idx%", "test");
    replace_string_in_place(str, "%unit_id%", "test");
    replace_string_in_place(str, "%unit_name%", "test");
    replace_string_in_place(str, "%timestamp%", "test");
    replace_string_in_place(str, "%value%", std::to_string(val));
}