#include "logging.h"

char buffer[640];
char *buffer_start = buffer;
char *buffer_free = buffer;
int buffer_data = 0;
int buffer_len = 512;
int vprintf_logging(const char *format, va_list arg)
{
  vprintf(format, arg);
  int written = vsnprintf(buffer_free, 128, format, arg);
  buffer_data += written;
  buffer_free += written;
  //printf("written %d bytes, data: %d\n", written, buffer_data);
  if (buffer_free > buffer + 512)
  { // time to wrap

    int overflow = (buffer_free) - (buffer + 512);
    buffer_len = 512 + overflow;
    //printf("time to wrap, overflow: %d\n", overflow);
    buffer_free = buffer;
  }
  if (buffer_data >= buffer_len) {
    //printf("updating ptr, data:%d ptr%p\n", buffer_data, buffer_start + 1);
    buffer_data = buffer_len;
    buffer_start = buffer_free + 1;
  }
  return written;
}

void xlog_web(httpd_req_t *req) {
  //printf("writing log to web, start: %p, free: %p (%d), data: %d, len: %d\n", buffer_start, buffer_free, buffer_free-buffer_start, buffer_data, buffer_len);
  int firstcopy = httpd_resp_send_chunk(req, buffer_start, std::min(buffer_data, buffer_len - (buffer_start - buffer)));
  httpd_resp_send_chunk(req, buffer, buffer_data - firstcopy);
  buffer_data = 0;
  buffer_start = buffer;
  buffer_free = buffer;
}

void init_logging() {
    esp_log_set_vprintf(vprintf_logging);
}