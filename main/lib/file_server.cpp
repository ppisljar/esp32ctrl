/* HTTP File Server Example

   This example code is in the Public Domain (or CC0 licensed, at your option.)

   Unless required by applicable law or agreed to in writing, this
   software is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
   CONDITIONS OF ANY KIND, either express or implied.
*/

#include "file_server.h"

#include "config.h"
#include "../plugins/plugin.h"
#include "rule_engine.h"
#include "logging.h"

/* Max length a file path can have on storage */
#define FILE_PATH_MAX (ESP_VFS_PATH_MAX + CONFIG_SPIFFS_OBJ_NAME_LEN)

/* Max size of an individual file. Make sure this
 * value is same as that set in upload_script.html */
#define MAX_FILE_SIZE   (200*1024) // 200 KB
#define MAX_FILE_SIZE_STR "200KB"

/* Scratch buffer size */
#define SCRATCH_BUFSIZE  8192

#define TAG "FileServer"

struct file_server_data {
    /* Base path of file storage */
    char base_path[ESP_VFS_PATH_MAX + 1];

    /* Scratch buffer for temporary storage during file transfer */
    char scratch[SCRATCH_BUFSIZE];
};

extern Config *cfg;
extern Plugin *active_plugins[10];
extern uint8_t event_triggers[8];
extern int averagerun;


char _snonce[33];
char _sopaque[33];
#define _srealm "authenticate"
#define qop_auth "qop=auth"

static char* md5str(char *in, char *out){
  mbedtls_md5_context _ctx;
  uint8_t i;
  uint8_t * _buf = (uint8_t*)malloc(16);
  if(_buf == NULL)
    return out;
  memset(_buf, 0x00, 16);
  mbedtls_md5_init(&_ctx);
  mbedtls_md5_starts(&_ctx);
  mbedtls_md5_update(&_ctx, (const uint8_t *)in, strlen(in));
  mbedtls_md5_finish(&_ctx, _buf);
  for(i = 0; i < 16; i++) {
    sprintf(out + (i * 2), "%02x", _buf[i]);
  }
  out[32] = 0;
  free(_buf);
  return out;
}

static bool startsWith(const char *pre, const char *str)
{
    size_t lenpre = strlen(pre),
           lenstr = strlen(str);
    return lenstr < lenpre ? false : strncmp(pre, str, lenpre) == 0;
}

void _extractParam(char* authReq, const char* param, const char delimit, char *value){
  char* _begin = strstr(authReq, param);
  if (_begin == nullptr) { 
    value[0] = 0;
    return;
  }
  char* start = _begin + strlen(param);
  int len = strchr(start, delimit) - start;
  strncpy(value, start, len);
  value[len] = 0;
}

char* _getRandomHexString(char *buffer) {
  int i;
  for(i = 0; i < 4; i++) {
    sprintf (buffer + (i*8), "%08x", esp_random());
  }
  return buffer;
}

#define USER_ADMIN "admin"
#define USER_USER "user"
#define USER_VIEW "view"

bool authenticate(httpd_req_t *req){
  JsonObject& params = cfg->getConfig();
  //char *username = (char*)(params["security"]["user"] | "admin");
  char password[32];
  strlcpy(password, params["security"]["pass"] | "", 32);
  if(httpd_req_get_hdr_value_len(req, "Authorization")) {
    char authReq[255];
    char _username[17];
    char _realm[17];
    char _nonce[33];
    char _opaque[33];
    char _uri[33];
    char _response[33];

    ESP_LOGD(TAG, "checking authorization");
    httpd_req_get_hdr_value_str(req, "Authorization", authReq, 255);
    if(startsWith("Digest", authReq)) {
      ESP_LOGD(TAG, "%s", authReq);

      _extractParam(authReq, "username=\"", '"', _username);
      if(!strlen(_username)) {
        ESP_LOGD(TAG, "username is empty %s", _username);
        authReq[0] = 0;
        return false;
      }

      if (strcmp(_username, USER_ADMIN) == 0) {}
      else if (strcmp(_username, USER_USER) == 0) {
        strlcpy(password, params["security"]["userpass"] | "", 32);
      } else if (strcmp(_username, USER_VIEW) == 0) {
        strlcpy(password, params["security"]["viewpass"] | "", 32);
      } else {
          ESP_LOGD(TAG, "username is invalid %s", _username);
      }
      // extracting required parameters for RFC 2069 simpler Digest
      _extractParam(authReq, "realm=\"", '"', _realm);
      _extractParam(authReq, "nonce=\"", '"', _nonce);
      _extractParam(authReq, "uri=\"", '"', _uri);
      _extractParam(authReq, "response=\"", '"', _response);
      _extractParam(authReq, "opaque=\"", '"', _opaque);

      if((!strlen(_realm)) || (!strlen(_nonce)) || (!strlen(_uri)) || (!strlen(_response)) || (!strlen(_opaque))) {
        authReq[0] = 0;
        return false;
      }
      if(strcmp(_opaque,_sopaque) != 0 || strcmp(_nonce, _snonce) != 0 || strcmp(_realm, _srealm) != 0) {
        ESP_LOGD(TAG, "something did not match");
        authReq[0] = 0;
        return false;
      }
      // parameters for the RFC 2617 newer Digest
      char _nc[33];
      char _cnonce[33];

      if(strstr(authReq, qop_auth) != nullptr) {
        _extractParam(authReq, "nc=", ',', _nc);
        _extractParam(authReq, "cnonce=\"", '"', _cnonce);
      }

      char _H1[33];
      char _H2[33];
      char _in[196];
      sprintf(_in, "%s:%s:%s", _username, _realm, password);
      md5str(_in, _H1);
      ESP_LOGD(TAG, "Hash of user:realm:pass [%s] =%s", _in, _H1);
      
      int _currentMethod = req->method;
      if(_currentMethod == HTTP_GET){
          sprintf(_in, "GET:%s", _uri);
          md5str(_in, _H2);
      }else if(_currentMethod == HTTP_POST){
          sprintf(_in, "POST:%s", _uri);
          md5str(_in, _H2);
      }else if(_currentMethod == HTTP_PUT){
          sprintf(_in, "PUT:%s", _uri);
          md5str(_in, _H2);
      }else if(_currentMethod == HTTP_DELETE){
          sprintf(_in, "DELETE:%s", _uri);
          md5str(_in, _H2);
      }else{
          sprintf(_in, "GET:%s", _uri);
          md5str(_in, _H2);
      }
      ESP_LOGD(TAG, "Hash of GET:uri [%s] =%s", _in, _H2);
      char _responsecheck[33];
      if(strstr(authReq, qop_auth) != nullptr) {
          sprintf(_in, "%s:%s:%s:%s:auth:%s", _H1, _nonce, _nc, _cnonce, _H2);
          md5str(_in, _responsecheck);
      } else {
          sprintf(_in, "%s:%s:%s", _H1, _nonce, _H2);
          md5str(_in, _responsecheck);
      }
      ESP_LOGD(TAG, "The Proper response [%s] =%s:%s", _in, _responsecheck, _response);
      if(strcmp(_response, _responsecheck) == 0){
        authReq[0] = 0;
        ESP_LOGI(TAG, "logged in with %s", _username);
        httpd_resp_set_hdr(req, "User", _username);
        httpd_resp_set_hdr(req, "Test", _username);
        httpd_resp_set_hdr(req, "TestUser", "admin");
        return true;
      }
    }
    authReq[0] = 0;
  }
  return false;
}



void requestAuthentication(httpd_req_t *req) {
    ESP_LOGD(TAG, "requesting authentication");
    _getRandomHexString(_snonce);
    _getRandomHexString(_sopaque);
    char digest_header[196];
    sprintf(digest_header, "Digest realm=\"%s\", qop=\"auth\", nonce=\"%s\", opaque=\"%s\"", _srealm, _snonce, _sopaque);
    httpd_resp_set_hdr(req, "WWW-Authenticate", digest_header);
    httpd_resp_set_status(req, "401 Unauthorized");
    httpd_resp_set_type(req, HTTPD_TYPE_TEXT);
    httpd_resp_send(req, "Please Authenticate", 20);
    //free(digest_header);
}

bool isAuthenticated(httpd_req_t *req, bool force = true) {
    ESP_LOGD(TAG, "checking if its authenticted");
    JsonObject& params = cfg->getConfig();
    if (params["security"]["ip_block"]["enabled"]) {
        uint32_t startIp = params["security"]["ip_block"]["start"];
        uint32_t endIp = params["security"]["ip_block"]["end"];

        struct sockaddr_in6 destAddr;
        unsigned socklen = sizeof(destAddr);

        int sockfd = httpd_req_to_sockfd(req);
        if(getpeername(sockfd, (struct sockaddr *)&destAddr, &socklen)<0) {
            ESP_LOGE(TAG, "getpeername failed, errno:%d",errno);
        }

        uint32_t clientIp = destAddr.sin6_addr.un.u32_addr[3];
        if (clientIp < startIp || clientIp > endIp) {
            ESP_LOGD(TAG, "IP not allowed %d", clientIp);
            return false;
        }
    }
    
    ESP_LOGD(TAG, "need to check user and pass");
    bool authenticated = authenticate(req);
    if (!authenticated && force)
    {
      ESP_LOGD(TAG, "requesting auth");
      requestAuthentication(req);
      return false;
    }
    return authenticated;
}

/* Send HTTP response with a run-time generated html consisting of
 * a list of all files and folders under the requested path */
static esp_err_t http_resp_dir_html(httpd_req_t *req)
{
    char fullpath[FILE_PATH_MAX];
    char entrysize[16];
    const char *entrytype;

    DIR *dir = NULL;
    struct dirent *entry;
    struct stat entry_stat;

    /* Retrieve the base path of file storage to construct the full path */
    strcpy(fullpath, ((struct file_server_data *)req->user_ctx)->base_path);

    /* Concatenate the requested directory path */
    strcat(fullpath, "/"/*req->uri*/);
    dir = opendir(fullpath);
    const size_t entrypath_offset = strlen(fullpath);

    if (!dir) {
        /* If opening directory failed then send 404 server error */
        httpd_resp_send_404(req);
        return ESP_OK;
    }

    /* Send file-list table definition and column labels */
    httpd_resp_sendstr_chunk(req, "[");

    bool first = true;
    /* Iterate over all files / folders and fetch their names and sizes */
    while ((entry = readdir(dir)) != NULL) {
        entrytype = (entry->d_type == DT_DIR ? "directory" : "file");
    
        strncpy(fullpath + entrypath_offset, entry->d_name, sizeof(fullpath) - entrypath_offset);
        if (stat(fullpath, &entry_stat) == -1) {
            ESP_LOGE(TAG, "Failed to stat %s : %s", entrytype, entry->d_name);
            continue;
        }
        sprintf(entrysize, "%ld", entry_stat.st_size);
        ESP_LOGD(TAG, "Found %s : %s (%s bytes)", entrytype, entry->d_name, entrysize);

        if (first) { first = false; }
        else { httpd_resp_sendstr_chunk(req, "," ); }
        /* Send chunk of HTML file containing table entries with file name and size */
        httpd_resp_sendstr_chunk(req, "{ \"file\":\"" );
        httpd_resp_sendstr_chunk(req, entry->d_name);
        if (entry->d_type == DT_DIR) {
            httpd_resp_sendstr_chunk(req, "/");
        }
        httpd_resp_sendstr_chunk(req, "\",\"name\":\"");
        httpd_resp_sendstr_chunk(req, entry->d_name);
        httpd_resp_sendstr_chunk(req, "\",\"type\":\"");
        httpd_resp_sendstr_chunk(req, entrytype);
        httpd_resp_sendstr_chunk(req, "\",\"size\":\"");
        httpd_resp_sendstr_chunk(req, entrysize);
        httpd_resp_sendstr_chunk(req, "\"}");
    }
    closedir(dir);

    /* Finish the file list table */
    httpd_resp_sendstr_chunk(req, "]");

    /* Send empty chunk to signal HTTP response completion */
    httpd_resp_sendstr_chunk(req, NULL);
    return ESP_OK;
}

#define IS_FILE_EXT(filename, ext) \
    (strcasecmp(&filename[strlen(filename) - sizeof(ext) + 1], ext) == 0)

/* Set HTTP response content type according to file extension */
static esp_err_t set_content_type_from_file(httpd_req_t *req, char *uri)
{
    if (IS_FILE_EXT(uri, ".pdf")) {
        return httpd_resp_set_type(req, "application/pdf");
    } else if (IS_FILE_EXT(uri, ".html") || IS_FILE_EXT(uri, ".htm")) {
        return httpd_resp_set_type(req, "text/html");
    } else if (IS_FILE_EXT(uri, ".jpeg") || IS_FILE_EXT(uri, ".jpg")) {
        return httpd_resp_set_type(req, "image/jpeg");
    }
    /* This is a limited set only */
    /* For any other type always set as plain text */
    return httpd_resp_set_type(req, "text/plain");
}

/* Send HTTP response with the contents of the requested file */
static esp_err_t http_resp_file(httpd_req_t *req, char* filepath)
{
    FILE *fd = NULL;
    struct stat file_stat;

    if (strlen(filepath) == 0) {
        /* Retrieve the base path of file storage to construct the full path */
        strcpy(filepath, ((struct file_server_data *)req->user_ctx)->base_path);

        /* Concatenate the requested file path */
        strcat(filepath, req->uri);
    }
   
    if (stat(filepath, &file_stat) == -1) {
        ESP_LOGE(TAG, "Failed to stat file : %s", filepath);
        /* If file doesn't exist respond with 404 Not Found */
        
        return ESP_OK;
    }

    fd = fopen(filepath, "r");
    if (!fd) {
        ESP_LOGE(TAG, "Failed to read existing file : %s", filepath);
        /* If file exists but unable to open respond with 500 Server Error */
        httpd_resp_set_status(req, "500 Server Error");
        httpd_resp_sendstr(req, "Failed to read existing file!");
        return ESP_OK;
    }

    ESP_LOGI(TAG, "Sending file : %s (%ld bytes)...", filepath, file_stat.st_size);
    set_content_type_from_file(req, filepath);

    /* Retrieve the pointer to scratch buffer for temporary storage */
    char *chunk = ((struct file_server_data *)req->user_ctx)->scratch;
    size_t chunksize;
    do {
        /* Read file in chunks into the scratch buffer */
        chunksize = fread(chunk, 1, SCRATCH_BUFSIZE, fd);

        /* Send the buffer contents as HTTP response chunk */
        if (httpd_resp_send_chunk(req, chunk, chunksize) != ESP_OK) {
            fclose(fd);
            ESP_LOGE(TAG, "File sending failed!");
            /* Abort sending file */
            httpd_resp_sendstr_chunk(req, NULL);
            /* Send error message with status code */
            httpd_resp_set_status(req, "500 Server Error");
            httpd_resp_sendstr(req, "Failed to send file!");
            return ESP_OK;
        }

        /* Keep looping till the whole file is sent */
    } while (chunksize != 0);

    /* Close file after sending complete */
    fclose(fd);
    ESP_LOGI(TAG, "File sending complete");

    /* Respond with an empty chunk to signal HTTP response completion */
    httpd_resp_send_chunk(req, NULL, 0);
    return ESP_OK;
}

/* Handler to download a file kept on the server */
static esp_err_t download_get_handler(httpd_req_t *req)
{
    //if (!isAuthenticated(req)) return ESP_OK;

    char filepath[FILE_PATH_MAX];
    // Check if the target is a directory
    if (req->uri[strlen(req->uri) - 1] == '/') {
        // In so, send an html with directory listing
        http_resp_dir_html(req);
    } else {
        // Else send the file
        http_resp_file(req, filepath);
    }
    return ESP_OK;
}

static esp_err_t config_get_handler(httpd_req_t *req)
{
    if (!isAuthenticated(req, true)) return ESP_OK;
    char filepath[FILE_PATH_MAX];
    strcpy(filepath, ((struct file_server_data *)req->user_ctx)->base_path);
    strcpy(filepath + strlen(filepath), "/config.json");
    http_resp_file(req, filepath);
    return ESP_OK;
}

static esp_err_t index_get_handler(httpd_req_t *req)
{
    char filepath[FILE_PATH_MAX];
    strcpy(filepath, ((struct file_server_data *)req->user_ctx)->base_path);
    strcpy(filepath + strlen(filepath), "/index.dev.htm");
    ESP_LOGI(TAG, "getting index %s", filepath);
    http_resp_file(req, filepath);
    return ESP_OK;
}

std::function<esp_err_t(httpd_req_t*)> handlers_404[10] = {};
static esp_err_t handler_404(httpd_req_t *req) {
    bool responded = false;
    //if (isAuthenticated(req, false)) {
        responded = download_get_handler(req);
    //}
    for (uint8_t i = 0; i < 10; i++) {
        if (responded || handlers_404[i] == nullptr) break;
        handlers_404[i](req);
    }
    if (!responded) {
        httpd_resp_send_404(req);
    }
    return ESP_OK;
}

void http_register_404_handler(std::function<esp_err_t(httpd_req_t*)> fn) {
    for (uint8_t i = 0; i < 10; i++) {
        if (handlers_404[i] == nullptr) {
            handlers_404[i] = fn;
        }
    }
}

#define MAX_FLASH_SIZE  1024000
static esp_err_t flash_post_handler(httpd_req_t *req) {
    if (!isAuthenticated(req, true)) return ESP_OK;

    const esp_partition_t *configured = esp_ota_get_boot_partition();
    const esp_partition_t *running = esp_ota_get_running_partition();
    esp_ota_handle_t update_handle = 0 ;
    const esp_partition_t *update_partition = NULL;

    if (configured != running) {
        ESP_LOGW(TAG, "Configured OTA boot partition at offset 0x%08x, but running from offset 0x%08x",
                 configured->address, running->address);
        ESP_LOGW(TAG, "(This can happen if either the OTA boot data or preferred boot image become corrupted somehow.)");
    }
    ESP_LOGD(TAG, "Running partition type %d subtype %d (offset 0x%08x)",
             running->type, running->subtype, running->address);


    if (req->content_len > MAX_FLASH_SIZE) {
        ESP_LOGE(TAG, "File too large : %d bytes", req->content_len);
        httpd_resp_set_status(req, "400 Bad Request");
        return ESP_FAIL;
    }

    update_partition = esp_ota_get_next_update_partition(NULL);
    ESP_LOGD(TAG, "Writing to partition subtype %d at offset 0x%x",
             update_partition->subtype, update_partition->address);
    assert(update_partition != NULL);    

    /* Retrieve the pointer to scratch buffer for temporary storage */
    char *buf = ((struct file_server_data *)req->user_ctx)->scratch;
    int received;

    /* Content length of the request gives
     * the size of the file being uploaded */
    int remaining = req->content_len;
    bool image_header_was_checked = false;
    esp_err_t err;

    while (remaining > 0) {

        ESP_LOGD(TAG, "Remaining size : %d", remaining);
        /* Receive the file part by part into a buffer */
        if ((received = httpd_req_recv(req, buf, MIN(remaining, SCRATCH_BUFSIZE))) <= 0) {
            if (received == HTTPD_SOCK_ERR_TIMEOUT) {
                /* Retry if timeout occurred */
                continue;
            }

            ESP_LOGE(TAG, "File reception failed!");
            /* Return failure reason with status code */
            httpd_resp_set_status(req, "500 Server Error");
            httpd_resp_sendstr(req, "Failed to receive file!");
            return ESP_FAIL;
        }

        if (image_header_was_checked == false) {
            esp_app_desc_t new_app_info;
            if (received > sizeof(esp_image_header_t) + sizeof(esp_image_segment_header_t) + sizeof(esp_app_desc_t)) {
                // check current version with downloading
                memcpy(&new_app_info, &buf[sizeof(esp_image_header_t) + sizeof(esp_image_segment_header_t)], sizeof(esp_app_desc_t));
                ESP_LOGD(TAG, "New firmware version: %s", new_app_info.version);

                esp_app_desc_t running_app_info;
                if (esp_ota_get_partition_description(running, &running_app_info) == ESP_OK) {
                    ESP_LOGD(TAG, "Running firmware version: %s", running_app_info.version);
                }

                const esp_partition_t* last_invalid_app = esp_ota_get_last_invalid_partition();
                esp_app_desc_t invalid_app_info;
                if (esp_ota_get_partition_description(last_invalid_app, &invalid_app_info) == ESP_OK) {
                    ESP_LOGD(TAG, "Last invalid firmware version: %s", invalid_app_info.version);
                }

                // check current version with last invalid partition
                if (last_invalid_app != NULL) {
                    if (memcmp(invalid_app_info.version, new_app_info.version, sizeof(new_app_info.version)) == 0) {
                        ESP_LOGW(TAG, "New version is the same as invalid version.");
                        ESP_LOGW(TAG, "Previously, there was an attempt to launch the firmware with %s version, but it failed.", invalid_app_info.version);
                        ESP_LOGW(TAG, "The firmware has been rolled back to the previous version.");
                        httpd_resp_set_status(req, "500 Server Error");
                        httpd_resp_sendstr(req, "Failed to receive file!");
                        return ESP_FAIL;
                    }
                }

                if (memcmp(new_app_info.version, running_app_info.version, sizeof(new_app_info.version)) == 0) {
                    // ESP_LOGW(TAG, "Current running version is the same as a new. We will not continue the update.");
                    // httpd_resp_set_status(req, "500 Server Error");
                    // httpd_resp_sendstr(req, "Failed to receive file!");
                    // return ESP_FAIL;
                }

                image_header_was_checked = true;

                err = esp_ota_begin(update_partition, OTA_SIZE_UNKNOWN, &update_handle);
                if (err != ESP_OK) {
                    ESP_LOGE(TAG, "esp_ota_begin failed (%s)", esp_err_to_name(err));
                    httpd_resp_set_status(req, "500 Server Error");
                    httpd_resp_sendstr(req, "Failed to receive file!");
                    return ESP_FAIL;
                }
                ESP_LOGD(TAG, "esp_ota_begin succeeded");
            } else {
                ESP_LOGE(TAG, "received package is not fit len");
                httpd_resp_set_status(req, "500 Server Error");
                httpd_resp_sendstr(req, "Failed to receive file!");
                return ESP_FAIL;
            }
        }
        err = esp_ota_write( update_handle, (const void *)buf, received);
        if (err != ESP_OK) {
            httpd_resp_set_status(req, "500 Server Error");
            httpd_resp_sendstr(req, "Failed to receive file!");
            return ESP_FAIL;
        }
        
       // ESP_LOGD(TAG, "Written image length %d", binary_file_length);

        /* Keep track of remaining size of
         * the file left to be uploaded */
        remaining -= received;
    }

    ESP_LOGD(TAG, "File reception complete");

    /* Redirect onto root to see the updated file list */
    httpd_resp_set_status(req, "303 See Other");
    httpd_resp_set_hdr(req, "Location", "/");
    httpd_resp_sendstr(req, "File uploaded successfully");

    vTaskDelay(2000 / portTICK_PERIOD_MS);
    esp_restart();
    return ESP_OK;
}

/* Handler to upload a file onto the server */
static esp_err_t upload_post_handler(httpd_req_t *req)
{
    if (!isAuthenticated(req, true)) return ESP_OK;

    char filepath[FILE_PATH_MAX];
    FILE *fd = NULL;
    struct stat file_stat;

    /* Skip leading "/upload" from URI to get filename */
    /* Note sizeof() counts NULL termination hence the -1 */
    const char *filename = req->uri + sizeof("/upload") - 1;

    /* Filename cannot be empty or have a trailing '/' */
    if (strlen(filename) == 0 || filename[strlen(filename) - 1] == '/') {
        ESP_LOGE(TAG, "Invalid file name : %s", filename);
        /* Respond with 400 Bad Request */
        httpd_resp_set_status(req, "400 Bad Request");
        /* Send failure reason */
        httpd_resp_sendstr(req, "Invalid file name!");
        return ESP_OK;
    }

    /* Retrieve the base path of file storage to construct the full path */
    strcpy(filepath, ((struct file_server_data *)req->user_ctx)->base_path);

    /* Concatenate the requested file path */
    strcat(filepath, filename);
    if (stat(filepath, &file_stat) == 0) {
        ESP_LOGD(TAG, "File already exists : %s", filepath);
        /* If file exists respond with 400 Bad Request */
        unlink(filepath);
    }

    /* File cannot be larger than a limit */
    if (req->content_len > MAX_FILE_SIZE) {
        ESP_LOGE(TAG, "File too large : %d bytes", req->content_len);
        httpd_resp_set_status(req, "400 Bad Request");
        httpd_resp_sendstr(req, "File size must be less than "
                           MAX_FILE_SIZE_STR "!");
        /* Return failure to close underlying connection else the
         * incoming file content will keep the socket busy */
        return ESP_FAIL;
    }

    fd = fopen(filepath, "w");
    if (!fd) {
        ESP_LOGE(TAG, "Failed to create file : %s", filepath);
        /* If file creation failed, respond with 500 Server Error */
        httpd_resp_set_status(req, "500 Server Error");
        httpd_resp_sendstr(req, "Failed to create file!");
        return ESP_OK;
    }

    ESP_LOGD(TAG, "Receiving file : %s...", filename);

    /* Retrieve the pointer to scratch buffer for temporary storage */
    char *buf = ((struct file_server_data *)req->user_ctx)->scratch;
    int received;

    /* Content length of the request gives
     * the size of the file being uploaded */
    int remaining = req->content_len;

    while (remaining > 0) {

        ESP_LOGD(TAG, "Remaining size : %d", remaining);
        /* Receive the file part by part into a buffer */
        if ((received = httpd_req_recv(req, buf, MIN(remaining, SCRATCH_BUFSIZE))) <= 0) {
            if (received == HTTPD_SOCK_ERR_TIMEOUT) {
                /* Retry if timeout occurred */
                continue;
            }

            /* In case of unrecoverable error,
             * close and delete the unfinished file*/
            fclose(fd);
            unlink(filepath);

            ESP_LOGE(TAG, "File reception failed!");
            /* Return failure reason with status code */
            httpd_resp_set_status(req, "500 Server Error");
            httpd_resp_sendstr(req, "Failed to receive file!");
            return ESP_OK;
        }

        /* Write buffer content to file on storage */
        if (received && (received != fwrite(buf, 1, received, fd))) {
            /* Couldn't write everything to file!
             * Storage may be full? */
            fclose(fd);
            unlink(filepath);

            ESP_LOGE(TAG, "File write failed!");
            httpd_resp_set_status(req, "500 Server Error");
            httpd_resp_sendstr(req, "Failed to write file to storage!");
            return ESP_OK;
        }

        /* Keep track of remaining size of
         * the file left to be uploaded */
        remaining -= received;
    }

    /* Close file upon upload completion */
    fclose(fd);
    ESP_LOGD(TAG, "File reception complete");

    /* Redirect onto root to see the updated file list */
    httpd_resp_set_status(req, "200 OK");
    httpd_resp_sendstr(req, "File uploaded successfully");
    return ESP_OK;
}

/* Handler to delete a file from the server */
static esp_err_t delete_post_handler(httpd_req_t *req)
{
    if (!isAuthenticated(req, false)) return ESP_OK;

    char filepath[FILE_PATH_MAX];
    struct stat file_stat;

    /* Skip leading "/upload" from URI to get filename */
    /* Note sizeof() counts NULL termination hence the -1 */
    const char *filename = req->uri + sizeof("/upload") - 1;

    /* Filename cannot be empty or have a trailing '/' */
    if (strlen(filename) == 0 || filename[strlen(filename) - 1] == '/') {
        ESP_LOGE(TAG, "Invalid file name : %s", filename);
        /* Respond with 400 Bad Request */
        httpd_resp_set_status(req, "400 Bad Request");
        /* Send failure reason */
        httpd_resp_sendstr(req, "Invalid file name!");
        return ESP_OK;
    }

    /* Retrieve the base path of file storage to construct the full path */
    strcpy(filepath, ((struct file_server_data *)req->user_ctx)->base_path);

    /* Concatenate the requested file path */
    strcat(filepath, filename);
    if (stat(filepath, &file_stat) == -1) {
        ESP_LOGE(TAG, "File does not exist : %s", filename);
        /* If file does not exist respond with 400 Bad Request */
        httpd_resp_set_status(req, "400 Bad Request");
        httpd_resp_sendstr(req, "File does not exist!");
        return ESP_OK;
    }

    ESP_LOGD(TAG, "Deleting file : %s", filename);
    /* Delete file */
    unlink(filepath);

    /* Redirect onto root to see the updated file list */
    httpd_resp_set_status(req, "200 OK");
    httpd_resp_sendstr(req, "File deleted successfully");
    return ESP_OK;
}

StaticJsonBuffer<JSON_OBJECT_SIZE(20)> jb;
static esp_err_t plugins_post_handler(httpd_req_t *req)
{
    if (!isAuthenticated(req, false)) return ESP_OK;

    /* Skip leading "/upload" from URI to get filename */
    /* Note sizeof() counts NULL termination hence the -1 */
    const char *filename = req->uri + sizeof("/plugins") - 1;

    if (strlen(filename) == 0 || filename[strlen(filename) - 1] == '/') {
        ESP_LOGE(TAG, "Invalid file name : %s", filename);
        /* Respond with 400 Bad Request */
        httpd_resp_set_status(req, "400 Bad Request");
        /* Send failure reason */
        httpd_resp_sendstr(req, "Invalid file name!");
        return ESP_OK;
    }
    // todo: check if plugin exists
    int plugin_id = atoi(filename);
    char buf[512];
    int remaining = req->content_len;
    httpd_req_recv(req, buf, MIN(remaining, 512));
    jb.clear();
    JsonObject& params = jb.parseObject(buf);
    active_plugins[plugin_id]->setConfig(params);

    httpd_resp_set_status(req, "200 OK");
    httpd_resp_sendstr(req, "OK");

    // try to get specific registered plugin
    return ESP_OK;
}

static esp_err_t plugins_handler(httpd_req_t *req)
{
    if (!isAuthenticated(req, false)) return ESP_OK;

    char buf[512];
    int len;
    const char *filename = req->uri + sizeof("/plugins") - 1;

    if (strlen(filename) == 0 || filename[strlen(filename) - 1] == '/') {
        // return list of all plugins
        JsonObject& cfgObject = cfg->getConfig();
        JsonArray& plugins = cfgObject["plugins"];
        len = plugins.printTo(buf, 512);
        httpd_resp_send_chunk(req, buf, len);
        httpd_resp_sendstr_chunk(req, NULL);
        return ESP_OK;
    }

    int plugin_id = atoi(filename);
    JsonObject& plugin = (cfg->getConfig())["plugins"][plugin_id];
    // JsonObject& cfgObject = active_plugins[plugin_id]->getConfig();
    // JsonObject& varObject = active_plugins[plugin_id]->getState();
    // plugin.set("config", cfgObject);
    // plugin.set("state", varObject);

    len = plugin.printTo(buf, 512);
    httpd_resp_send_chunk(req, buf, len);
    httpd_resp_sendstr_chunk(req, NULL);

    // try to get specific registered plugin
    return ESP_OK;
}



static esp_err_t plugins_state_handler(httpd_req_t *req)
{
    if (!isAuthenticated(req, false)) return ESP_OK;

    char buf[512];
    int len;

    jb.clear();
    JsonArray& plugins = jb.createArray();
    for (auto plugin : active_plugins) {
        if (plugin == NULL) continue;
        JsonObject &p = plugins.createNestedObject();
        plugin->getState(p);
    }

    len = plugins.printTo(buf, 512);
    httpd_resp_send_chunk(req, buf, len);
    httpd_resp_sendstr_chunk(req, NULL);

    // try to get specific registered plugin
    return ESP_OK;
}

static esp_err_t plugins_list_handler(httpd_req_t *req)
{
    if (!isAuthenticated(req, false)) return ESP_OK;

    // get plugin restiry and list all available plugins
    bool first=true;
    char id[4];
    httpd_resp_sendstr_chunk(req, "[");
    for(auto it = Plugin::protoTable.begin(); it != Plugin::protoTable.end(); it++) {
        if (first) { first = false; }
        else { httpd_resp_sendstr_chunk(req, "," ); }

        sprintf(id, "%d", it->first);
        httpd_resp_sendstr_chunk(req, id);
    }
    httpd_resp_sendstr_chunk(req, "]");
    httpd_resp_sendstr_chunk(req, NULL);

    // try to get specific registered plugin
    return ESP_OK;
}

static esp_err_t reboot_handler(httpd_req_t *req)
{
    if (!isAuthenticated(req, false)) return ESP_FAIL;

    httpd_resp_set_status(req, "200 OK");
    httpd_resp_sendstr(req, "OK");
    vTaskDelay(2000 / portTICK_PERIOD_MS);

    esp_restart();
    return ESP_OK;
}

static esp_err_t event_handler(httpd_req_t *req)
{
    if (!isAuthenticated(req, false)) return ESP_OK;

    const char *eventName = req->uri + sizeof("/event/") - 1;
    if (strlen(eventName) == 0 || eventName[strlen(eventName) - 1] == '/') {
        // return list of all plugins
        httpd_resp_send_404(req);
        return ESP_OK;
    }
    ESP_LOGD(TAG, "received event: '%s'", eventName);

    char* confData = spiffs_read_file("/spiffs/events.json"); // todo: possible memory leak in spiffs func
    if (confData == NULL) {
        httpd_resp_set_status(req, "200 OK");
        httpd_resp_sendstr(req, "EVENT NOT FOUND"); // todo: json response
    }
    jb.clear();
    JsonObject& events = jb.parseObject(confData); // todo: problem with multuple clients overriding json object
    ESP_LOGD(TAG, "events loaded: %d", (int)events["heat_off"]);
    if (!events.containsKey(eventName)) {
        httpd_resp_set_status(req, "200 OK");
        httpd_resp_sendstr(req, "EVENT NOT FOUND"); // todo: json response
        return ESP_OK;
    }
    uint8_t event = events[eventName];
    TRIGGER_EVENT(event);
    httpd_resp_set_status(req, "200 OK");
    httpd_resp_sendstr(req, "OK");
    return ESP_OK;
}

static esp_err_t system_handler(httpd_req_t *req)
{
    if (!isAuthenticated(req, false)) return ESP_OK;

    char buf[512];
    int len; int ret;

    jb.clear();
    JsonObject& sys = jb.createObject();
    sys["uptime"] = xTaskGetTickCount() * portTICK_PERIOD_MS / 1000;
    sys["heap"] = xPortGetFreeHeapSize();

    sys["re_exec_time"] = averagerun;
    size_t total = 0, used = 0;
    ret = esp_spiffs_info(NULL, &total, &used);
    sys["fs_total"] = total;
    sys["fs_used"] = used;
    
    len = sys.printTo(buf, 512);
    httpd_resp_send_chunk(req, buf, len);
    httpd_resp_sendstr_chunk(req, NULL);
    return ESP_OK;
}

static esp_err_t logs_handler(httpd_req_t *req)
{
    if (!isAuthenticated(req, false)) return ESP_OK;

    xlog_web(req);
    httpd_resp_sendstr_chunk(req, NULL);
    return ESP_OK;
}

int8_t level;
int8_t lastLevel;
static void json_init() {
  level = 0;
  lastLevel = -1;
}

static void json_quote_name(httpd_req_t *req, const char* val) {
  if (lastLevel == level) httpd_resp_sendstr_chunk(req, ",");
  if (strlen(val) > 0) {
    httpd_resp_sendstr_chunk(req, "\"");
    httpd_resp_sendstr_chunk(req, val);
    httpd_resp_sendstr_chunk(req, "\"");
    httpd_resp_sendstr_chunk(req, ":");
  }
}

static void json_quote_val(httpd_req_t *req, const char* val) {
  httpd_resp_sendstr_chunk(req, "\"");
  httpd_resp_sendstr_chunk(req, val);
  httpd_resp_sendstr_chunk(req, "\"");
}

static void json_open(httpd_req_t *req, bool arr = false, const char* name = "") {
  json_quote_name(req, name);
  httpd_resp_sendstr_chunk(req, arr ? "[" : "{");
  lastLevel = level;
  level++;
}

static void json_close(httpd_req_t *req, bool arr = false) {
  httpd_resp_sendstr_chunk(req, arr ? "]" : "}");
  level--;
  lastLevel = level;
}

static void json_number(httpd_req_t *req, const char* name, const char* value) {
  json_quote_name(req, name);
  json_quote_val(req, value);
  lastLevel = level;
}

static void json_prop(httpd_req_t *req, const char* name, const char* value) {
  json_quote_name(req, name);
  json_quote_val(req, value);
  lastLevel = level;
}

static esp_err_t cmd_handler(httpd_req_t *req)
{
    if (!isAuthenticated(req, false)) return ESP_OK;

    const char *eventName = req->uri + sizeof("/cmd/") - 1;
    if (strlen(eventName) == 0 || eventName[strlen(eventName) - 1] == '/') {
        // return list of all plugins
        httpd_resp_send_404(req);
        return ESP_OK;
    }

    char buf[255];
    int len = req->content_len;
    httpd_req_recv(req, buf, MIN(len, 255));

    run_rule((unsigned char*)buf, len);

    json_init();
    json_open(req);
    json_prop(req, "response", "OK");
    json_close(req);
    httpd_resp_sendstr_chunk(req, NULL);
    return ESP_OK;
}

httpd_handle_t server = NULL;

void http_quick_register(const char * uri, httpd_method_t method,  esp_err_t handler(httpd_req_t *req), void *ctx) {
    ESP_LOGI(TAG, "registering handler %p for uri %s", handler, uri);
    httpd_uri_t uri_handler = {
        .uri       = uri,
        .method    = method,
        .handler   = handler,
        .user_ctx  = ctx
    };
    httpd_register_uri_handler(server, &uri_handler);
}

extern esp_err_t hueemulator_webhandler(httpd_req_t *req);

/* Function to start the file server */
esp_err_t start_file_server(const char *base_path)
{
    static struct file_server_data *server_data = NULL;
    ESP_LOGI(TAG, "starting");
    /* Validate file storage base path */
    if (!base_path || strcmp(base_path, "/spiffs") != 0) {
        ESP_LOGE(TAG, "File server presently supports only '/spiffs' as base path");
        return ESP_ERR_INVALID_ARG;
    }

    if (server_data) {
        ESP_LOGE(TAG, "File server already started");
        return ESP_ERR_INVALID_STATE;
    }

    /* Allocate memory for server data */
    server_data = (file_server_data*)calloc(1, sizeof(struct file_server_data));
    if (!server_data) {
        ESP_LOGE(TAG, "Failed to allocate memory for server data");
        return ESP_ERR_NO_MEM;
    }
    strlcpy(server_data->base_path, base_path, sizeof(server_data->base_path));


    httpd_config_t config = HTTPD_DEFAULT_CONFIG();

    /* Use the URI wildcard matching function in order to
     * allow the same handler to respond to multiple different
     * target URIs which match the wildcard scheme */
    config.uri_match_fn = httpd_uri_match_wildcard;
    config.max_uri_handlers = 20;

    ESP_LOGD(TAG, "Starting HTTP Server");
    if (httpd_start(&server, &config) != ESP_OK) {
        ESP_LOGE(TAG, "Failed to start file server!");
        return ESP_FAIL;
    }

    http_quick_register("/", HTTP_GET, index_get_handler, server_data);
    http_quick_register("/config.json", HTTP_GET, config_get_handler, server_data);
    http_quick_register("/update", HTTP_POST, flash_post_handler, server_data);
    // upload
    // delete
    // rename

    http_quick_register("/description.xml", HTTP_GET, hueemulator_webhandler, nullptr);

    //http_quick_register("/config/*", HTTP_GET, plugins_delete_handler, server_data);
    //http_quick_register("/config/*", HTTP_POST, plugins_delete_handler, server_data);

    http_quick_register("/plugins_list", HTTP_GET, plugins_list_handler, server_data);
    http_quick_register("/plugins/*", HTTP_GET, plugins_handler, server_data);
    http_quick_register("/plugins/*", HTTP_POST, plugins_post_handler, server_data);
    //http_quick_register("/plugins/*", HTTP_DELETE, plugins_delete_handler, server_data);
    http_quick_register("/plugin_state/*", HTTP_GET, plugins_state_handler, server_data);

    http_quick_register("/event/*", HTTP_GET, event_handler, server_data);
    http_quick_register("/cmd/*", HTTP_POST, cmd_handler, server_data);
    http_quick_register("/system", HTTP_GET, system_handler, server_data);
    http_quick_register("/logs", HTTP_GET, logs_handler, server_data);

    http_quick_register("/filelist", HTTP_GET, http_resp_dir_html, server_data);
    http_quick_register("/reboot", HTTP_GET, reboot_handler, server_data);


    http_quick_register("/api/*", HTTP_PUT, handler_404, server_data);
    /* URI handler for getting uploaded files */
    httpd_uri_t file_download = {
        .uri       = "/*",  // Match all URIs of type /path/to/file (except index.html)
        .method    = HTTP_GET,
        .handler   = handler_404,
        .user_ctx  = server_data    // Pass server data as context
    };
    httpd_register_uri_handler(server, &file_download);

    /* URI handler for uploading files to server */
    httpd_uri_t file_upload = {
        .uri       = "/upload/*",   // Match all URIs of type /upload/path/to/file
        .method    = HTTP_POST,
        .handler   = upload_post_handler,
        .user_ctx  = server_data    // Pass server data as context
    };
    httpd_register_uri_handler(server, &file_upload);

    /* URI handler for deleting files from server */
    httpd_uri_t file_delete = {
        .uri       = "/delete/*",   // Match all URIs of type /delete/path/to/file
        .method    = HTTP_POST,
        .handler   = delete_post_handler,
        .user_ctx  = server_data    // Pass server data as context
    };
    httpd_register_uri_handler(server, &file_delete);

    return ESP_OK;
}
