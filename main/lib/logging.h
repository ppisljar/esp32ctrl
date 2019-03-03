#ifndef ESP_LIB_LOGGING_H
#define ESP_LIB_LOGGING_H

#include <stdio.h>
#include <stdlib.h>
#include <stdarg.h>
#include <algorithm>

#include "esp_err.h"
#include "esp_log.h"
#include "esp_http_server.h"

void init_logging();
void xlog_web(httpd_req_t *req);

#endif