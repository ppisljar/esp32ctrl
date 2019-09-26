#include "logging.h"
#include "esp_http_server.h"
#include <sys/socket.h>

int log_clients[4] = { -1, -1, -1, -1 };
char buffer[512];


int sent = 0;
bool ok = true;
int vprintf_logging(const char *format, va_list arg)
{
  vprintf(format, arg);
  int written = vsnprintf(buffer, 511, format, arg);
  for (int i = 0; i < 4; i++) {
    if (log_clients[i] != -1) {
      sent = send(log_clients[i], "event: message\ndata: ", sizeof("event: message\ndata: ") - 1, 0);
      if (sent < 0) {
        printf("logging client disconnected\n");
        log_clients[i] = -1;
        continue;
      }
      
      sent = send(log_clients[i], buffer, written, 0);
      if (sent < 0) {
        printf("logging client disconnected\n");
        log_clients[i] = -1;
        continue;
      }
      sent = send(log_clients[i], "\n\n", 2, 0);
      if (sent < 0) {
        printf("logging client disconnected\n");
        log_clients[i] = -1;
        continue;
      }
        
    }
  }

  return 0;
}

void xlog_web(httpd_req_t *req) { // this is request handler for http server
  int i = 0;
  while (log_clients[i] != -1 && i < 4) {
    i++;
  }
  if (log_clients[i] != -1) {
    printf("all logging client slots taken\n");
    httpd_resp_set_status(req, "404");
    httpd_resp_sendstr_chunk(req, nullptr);
    return;
  }
  //printf("using logging client slot %d\n", i);
  log_clients[i] = httpd_req_to_sockfd(req);
  
  const char *httpd_hdr_str = "HTTP/1.1 200\r\nContent-Type: text/event-stream;charset=UTF-8\r\nCache-Control: no-cache\r\n\r\n";
  send(log_clients[i], httpd_hdr_str, strlen(httpd_hdr_str), 0);
}

void xlog_set(httpd_req_t *req) {
  const char *tag = req->uri + sizeof("/logs/") - 1;

  char *mode = strchr(tag, '/');
  if (mode == nullptr) {
    httpd_resp_sendstr(req, "invalid request (no tag)");
    return;
  }
  mode[0] = 0;
  mode++;
  int log_level = atoi(mode);

  ESP_LOGI("Logging", "setting log level for %s to %i", tag, log_level);
  esp_log_level_set(tag, (esp_log_level_t)log_level);

  httpd_resp_sendstr(req, "OK");
}

void init_logging() {
  esp_log_set_vprintf(vprintf_logging);
}