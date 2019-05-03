#include "utils.h"

bool string_to_lower(std::string& subject) {
    for (auto& c : subject) {
        c = std::tolower(c);
    }
    return true;
}

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

void makeHttpRequest(char *url, esp_http_client_method_t method) {
    esp_http_client_config_t config = {
        .url = url
    };
    esp_http_client_handle_t client = esp_http_client_init(&config);

    esp_http_client_set_method(client, method);

    esp_err_t err = esp_http_client_perform(client);

    if (err == ESP_OK) {
        ESP_LOGI("HttpRequest", "Status = %d, content_length = %d",
            esp_http_client_get_status_code(client),
            esp_http_client_get_content_length(client));
    } else {
        ESP_LOGW("HttpRequest", "request failed");
    }
    esp_http_client_cleanup(client);
}