#ifndef ESP_LIB_HTTP_SERVER_H
#define ESP_LIB_HTTP_SERVER_H

#include <stdio.h>
#include <string.h>
#include <sys/param.h>
#include <sys/unistd.h>
#include <sys/stat.h>
#include <sys/socket.h>
#include <dirent.h>

#include "esp_err.h"
#include "esp_log.h"

#include "esp_vfs.h"
#include "esp_spiffs.h"
#include "esp_http_server.h"

#include "esp_ota_ops.h"
#include "esp_flash_partitions.h"
#include "esp_partition.h"

#include "mbedtls/md5.h"

esp_err_t start_file_server(const char *base_path);
static bool isAuthenticated(httpd_req_t *req);
static bool authenticate(httpd_req_t *req, const char * username, const char * password);

#endif