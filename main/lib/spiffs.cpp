#include "spiffs.h"
#define TAG "SPIFFS"
/* Function to initialize SPIFFS */
esp_err_t spiffs_init(void)
{
    ESP_LOGI(TAG, "Initializing SPIFFS");

    esp_vfs_spiffs_conf_t conf = {
      .base_path = "/spiffs",
      .partition_label = NULL,
      .max_files = 50,   // This decides the maximum number of files that can be created on the storage
      .format_if_mount_failed = true
    };

    esp_err_t ret = esp_vfs_spiffs_register(&conf);
    if (ret != ESP_OK) {
        if (ret == ESP_FAIL) {
            ESP_LOGE(TAG, "Failed to mount or format filesystem");
        } else if (ret == ESP_ERR_NOT_FOUND) {
            ESP_LOGE(TAG, "Failed to find SPIFFS partition");
        } else {
            ESP_LOGE(TAG, "Failed to initialize SPIFFS (%s)", esp_err_to_name(ret));
        }
        return ESP_FAIL;
    }

    size_t total = 0, used = 0;
    ret = esp_spiffs_info(NULL, &total, &used);
    if (ret != ESP_OK) {
        ESP_LOGE(TAG, "Failed to get SPIFFS partition information (%s)", esp_err_to_name(ret));
        return ESP_FAIL;
    } 

    ESP_LOGI(TAG, "Partition size: total: %d, used: %d", total, used);
    return ESP_OK;
}

char* spiffs_read_file(char * filename, long *len) {
    ESP_LOGI(TAG, "loading file %s", filename);
    FILE *f = fopen(filename, "rb");
    if (f == NULL) return NULL;

    fseek(f, 0, SEEK_END);
    *len = ftell(f);
    fseek(f, 0, SEEK_SET);  /* same as rewind(f); */

    ESP_LOGI(TAG, "total size of file: %lu", *len);
    char *data = (char*)malloc(*len + 1);
    fread(data, *len, 1, f);
    fclose(f);
    ESP_LOGI(TAG, "File read succesfully");
    return data;
}
char* spiffs_read_file(char * filename) {
    long len;
    return spiffs_read_file(filename, &len);
}

esp_err_t spiffs_write_file(char *filepath, char * data, uint16_t length) {
    ESP_LOGI(TAG, "Writing file %s with  bytes", filepath);
    FILE *fd = fopen(filepath, "w");
    if (!fd) {
        ESP_LOGE(TAG, "Failed to create file : %s", filepath);
        return ESP_FAIL;
    }
    fwrite(data, 1, length, fd);
    fclose(fd);
    ESP_LOGI(TAG, "File write succesfull");
    return ESP_OK;
}

// static esp_err_t spiffs_delete_file() {

// }

// static esp_err_t spiffs_copy_file() {

// }

// static esp_err_t spiffs_rename_file() {

// }


