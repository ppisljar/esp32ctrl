#include "c011_profiles.h"

static const char *TAG = "ProfilesPlugin";

PLUGIN_CONFIG(ProfilesPlugin, enabled, enabled)
PLUGIN_STATS(ProfilesPlugin, current_profile, current_step);

//JsonObject& getProfile(uint8_t profile_id) {
//	JsonArray& profiles = (*cfg);
//	for (int i = 0; i < profiles.size(); i++) {
//		if (profiles[i]["id"].as<int>() == profile_id) {
//			return profiles[i];
//		}
//	}
//	return nullptr;
//}
void ProfilesPlugin::setProfile(uint8_t profile_id) {
	
	current_profile = profile_id;
}

void ProfilesPlugin::setStep(uint16_t step) {
	current_step = step;
}

bool ProfilesPlugin::init(JsonObject &params) {
    cfg = &((JsonObject &)params);
    state_cfg = &((JsonArray &)params["state"]);

    return true;
}