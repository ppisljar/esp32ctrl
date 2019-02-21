#ifndef ESP_LIB_SPIFFS_H
#define ESP_LIB_SPIFFS_H

#include "esp_spiffs.h"

/* Function to initialize SPIFFS */
static esp_err_t spiffs_init(void);
static char* spiffs_read_file(char * filename);
static esp_err_t spiffs_write_file(char *filepath, char * data, uint16_t length);

// static esp_err_t spiffs_delete_file() {

// }

// static esp_err_t spiffs_copy_file() {

// }

// static esp_err_t spiffs_rename_file() {

// }


#endif