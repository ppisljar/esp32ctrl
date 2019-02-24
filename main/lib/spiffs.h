#ifndef ESP_LIB_SPIFFS_H
#define ESP_LIB_SPIFFS_H

#include "esp_spiffs.h"
#include "esp_err.h"
#include "esp_log.h"

/* Function to initialize SPIFFS */
static esp_err_t spiffs_init(void);
static char* spiffs_read_file(char * filename, long *len);
static char* spiffs_read_file(char * filename);
static esp_err_t spiffs_write_file(char *filepath, char * data, uint16_t length);

// static esp_err_t spiffs_delete_file() {

// }

// static esp_err_t spiffs_copy_file() {

// }

// static esp_err_t spiffs_rename_file() {

// }


#endif