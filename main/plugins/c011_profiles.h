#ifndef ESP_PLUGIN_c011_H
#define ESP_PLUGIN_c011_H


#include "plugin_defs.h"

class ProfilesPlugin: public Plugin {
    private:
        bool enabled = true;
    public:
        uint8_t current_profile;
        uint16_t current_step;
        Type current_profile_type = Type::byte;
        Type current_step_type = Type::integer;
        DEFINE_PLUGIN(ProfilesPlugin);

        void setProfile(uint8_t profile_id);
        void setStep(uint16_t step);
};


#endif