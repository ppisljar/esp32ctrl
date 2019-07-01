#include "bluetooth.h"



#define GATTC_TAG "gattc"
const uint32_t scan_duration = 10; // seconds ?
bool scan_complete = false;

///Declare static functions
static void esp_gap_cb(esp_gap_ble_cb_event_t event, esp_ble_gap_cb_param_t *param);

static esp_ble_scan_params_t ble_scan_params = {
  .scan_type              = BLE_SCAN_TYPE_ACTIVE,
  .own_addr_type          = BLE_ADDR_TYPE_PUBLIC,
  .scan_filter_policy     = BLE_SCAN_FILTER_ALLOW_ALL,
  .scan_interval          = 0x50,
  .scan_window            = 0x30,
  .scan_duplicate         = BLE_SCAN_DUPLICATE_DISABLE
};

static esp_gatt_srvc_id_t search_service_id = {
    .id = {
        .uuid = {
            .len = ESP_UUID_LEN_16,
            .uuid = {.uuid16 = 0x1811,},
        },
        .inst_id = 0,
    },
    .is_primary = true,
};

static esp_gatt_id_t write_charracteristic_id = {
    .uuid = {
        .len = ESP_UUID_LEN_16,
        .uuid = {.uuid16 = ESP_GATT_UUID_CHAR_CLIENT_CONFIG,},
    },
    .inst_id = 0,
};

struct ble_connected_devices {
  uint8_t mac[6];
  uint16_t service_id;
  uint16_t characteristic_id;
  void (*format_data)(char* data, uint8_t R, uint8_t G, uint8_t B, uint8_t W);
  uint8_t data_length;
  uint16_t speaker_id;
  uint8_t device_type;
  uint16_t conn_id;
} ble_connected_devices;

struct ble_device {
  char name[20];
  uint8_t mac[6];
} ble_device;

struct ble_service {
  uint16_t id;
} ble_service;

struct ble_charracteristics {
  uint16_t id;
} ble_charracteristics;

struct ble_device devices[15];
struct ble_service services[20];
struct ble_charracteristics charracteristics[20];
struct ble_connected_devices connected_devices[5];

int8_t services_found = 0;
int8_t charracteristics_found = 0;
int8_t devices_found = 0;
int8_t find_device(uint8_t* mac) {
  for (uint8_t i = 0; i < devices_found; i++) {
    if (memcmp(mac, devices[i].mac, 6) == 0) {
      return i;
    }
  }
  return -1;
}
int8_t find_connected_device(uint8_t* mac) {
  for (uint8_t i = 0; i < 5; i++) {
    if (memcmp(mac, connected_devices[i].mac, 6) == 0) {
      return i;
    }
  }
  return -1;
}

esp_gatt_if_t gatt_if = 0;

void format_data_1(char* data, uint8_t R, uint8_t G, uint8_t B, uint8_t W) {
  memcpy(data, "\x01\xfe\x00\x00\x53\x83\x10\x00RGB\x00\x50W\x00\x00", 16);
  data[8] = R;
  data[9] = G;
  data[10] = B;
  data[13] = W;
}

void format_data_2(char* data, uint8_t R, uint8_t G, uint8_t B, uint8_t W) {
  memcpy(data, "\x7e\xfe\xff\xff\xff\x00\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00\x00\xfc\x00\x7e", 20);
  data[15] = W ? 0 : 1;
  data[17] = (data[17] + data[15]);
}

void load_preset_devices() {
  memcpy(connected_devices[1].mac, "\xf4\x4e\xfd\x12\x5a\xb8", 6);
  connected_devices[1].service_id = 0x7777;
  connected_devices[1].characteristic_id = 0x8877;
  connected_devices[1].format_data = format_data_1;
  connected_devices[1].data_length = 16;
  connected_devices[1].speaker_id = 0;

  memcpy(connected_devices[2].mac, "\x08\x7c\xbe\x2f\xe7\x64", 6);
  connected_devices[2].service_id = 0xcc02;
  connected_devices[2].characteristic_id = 0xee03;
  connected_devices[2].format_data = format_data_2;
  connected_devices[2].data_length = 20;
  connected_devices[2].speaker_id = 0;


  esp_ble_gattc_open(gatt_if, connected_devices[1].mac, (esp_ble_addr_type_t)0, true);
  esp_ble_gattc_open(gatt_if, connected_devices[2].mac, (esp_ble_addr_type_t)0, true);
  //esp_err_t resp = esp_a2d_sink_connect(connected_devices[0].mac);
  //printf("sink_connect status: %d\n", resp);
}


static void esp_gattc_cb(esp_gattc_cb_event_t event, esp_gatt_if_t gattc_if, esp_ble_gattc_cb_param_t *param)
{
    ESP_LOGI(GATTC_TAG, "EVT %d, gattc if %d\n", event, gattc_if);
    esp_ble_gattc_cb_param_t *p_data = (esp_ble_gattc_cb_param_t *)param;
    uint8_t did;

    switch (event) {
      case ESP_GATTC_REG_EVT:
        // this happens when we call APP register
          ESP_LOGI(GATTC_TAG, "REG_EVT\n");
          if (param->reg.status == ESP_GATT_OK) {
            gatt_if = gattc_if;
          } else {
              ESP_LOGI(GATTC_TAG, "Reg app failed, app_id %04x, status %d\n",
                      param->reg.app_id,
                      param->reg.status);
          }
          break;
      case ESP_GATTC_UNREG_EVT:
          break;
      case ESP_GATTC_OPEN_EVT: {
          // this happens when we open a connection (esp_ble_gattc_open)
          ESP_LOGI(GATTC_TAG, "ESP_GATTC_OPEN_EVT conn_id %d, if %d, status %d, mtu %d\n", p_data->open.conn_id, gattc_if, p_data->open.status, p_data->open.mtu);
          ESP_LOGI(GATTC_TAG, "REMOTE BDA  %02x:%02x:%02x:%02x:%02x:%02x\n",
              p_data->open.remote_bda[0], p_data->open.remote_bda[1],
              p_data->open.remote_bda[2], p_data->open.remote_bda[3],
              p_data->open.remote_bda[4], p_data->open.remote_bda[5]
          );

          if (p_data->open.status != ESP_OK) {
            ESP_LOGE(GATTC_TAG, "ESP_GATTC_OPEN_EVT connection failed!");
            esp_ble_gattc_open(gattc_if, p_data->open.remote_bda, (esp_ble_addr_type_t)0, true);
            break;
          }

          // check if device is on connection list
          if (find_connected_device(p_data->open.remote_bda) == -1) {
            memcpy(connected_devices[0].mac, p_data->open.remote_bda, sizeof(esp_bd_addr_t));
          }

          did = find_connected_device(p_data->open.remote_bda);
          connected_devices[did].conn_id = p_data->open.conn_id;

          esp_err_t mtu_ret = esp_ble_gattc_send_mtu_req (gattc_if, p_data->open.conn_id);
          if (mtu_ret){
              ESP_LOGE(GATTC_TAG, "config MTU error, error code = %x", mtu_ret);
          }
          break;
      } case ESP_GATTC_CFG_MTU_EVT:
        if (param->cfg_mtu.status != ESP_GATT_OK){
            ESP_LOGE(GATTC_TAG,"Config mtu failed");
        }
        ESP_LOGI(GATTC_TAG, "Status %d, MTU %d, conn_id %d", param->cfg_mtu.status, param->cfg_mtu.mtu, param->cfg_mtu.conn_id);
        //esp_ble_gattc_search_service(gattc_if, param->cfg_mtu.conn_id, &remote_filter_service_uuid);
        break;
      case ESP_GATTC_CLOSE_EVT:
        // connection closed ...
        ESP_LOGI(GATTC_TAG, "ESP_GATTC_CLOSE_EVT conn_id %d, if %d, status %d\n", p_data->close.conn_id, gattc_if, p_data->close.status);

        if (find_connected_device(p_data->close.remote_bda) != -1) {
          // device is still listed in the connected list ... reconnect
          printf("reopening ...\n");
          esp_ble_gattc_open(gattc_if, p_data->close.remote_bda, (esp_ble_addr_type_t)0, true);
        }
        break;
    case ESP_GATTC_SEARCH_RES_EVT: {
        esp_gatt_id_t *srvc_id = &p_data->search_res.srvc_id;
        ESP_LOGI(GATTC_TAG, "SEARCH RES: conn_id = %x is primary service %d", p_data->search_res.conn_id, p_data->search_res.is_primary);
        ESP_LOGI(GATTC_TAG, "start handle %d end handle %d current handle value %d", p_data->search_res.start_handle, p_data->search_res.end_handle, p_data->search_res.srvc_id.inst_id);
        
        if (srvc_id->uuid.len == ESP_UUID_LEN_16) {
            ESP_LOGI(GATTC_TAG, "UUID16: %x\n", srvc_id->uuid.uuid.uuid16);
            services[services_found++].id = srvc_id->uuid.uuid.uuid16;
        } else if (srvc_id->uuid.len == ESP_UUID_LEN_32) {
            ESP_LOGI(GATTC_TAG, "UUID32: %x\n", srvc_id->uuid.uuid.uuid32);
        } else if (srvc_id->uuid.len == ESP_UUID_LEN_128) {
            ESP_LOGI(GATTC_TAG, "UUID128: %x,%x,%x,%x,%x,%x,%x,%x,%x,%x,%x,%x,%x,%x,%x,%x\n", srvc_id->uuid.uuid.uuid128[0],
                     srvc_id->uuid.uuid.uuid128[1], srvc_id->uuid.uuid.uuid128[2], srvc_id->uuid.uuid.uuid128[3],
                     srvc_id->uuid.uuid.uuid128[4], srvc_id->uuid.uuid.uuid128[5], srvc_id->uuid.uuid.uuid128[6],
                     srvc_id->uuid.uuid.uuid128[7], srvc_id->uuid.uuid.uuid128[8], srvc_id->uuid.uuid.uuid128[9],
                     srvc_id->uuid.uuid.uuid128[10], srvc_id->uuid.uuid.uuid128[11], srvc_id->uuid.uuid.uuid128[12],
                     srvc_id->uuid.uuid.uuid128[13], srvc_id->uuid.uuid.uuid128[14], srvc_id->uuid.uuid.uuid128[15]);
        } else {
            ESP_LOGE(GATTC_TAG, "UNKNOWN LEN %d\n", srvc_id->uuid.len);
        }
        break;
    }
    case ESP_GATTC_SEARCH_CMPL_EVT:
        ESP_LOGI(GATTC_TAG, "SEARCH_CMPL: conn_id = %x, status %d\n", p_data->search_cmpl.conn_id, p_data->search_cmpl.status);
        scan_complete = true;
        break;
    case ESP_GATTC_READ_CHAR_EVT:
        if (p_data->read.status != ESP_GATT_OK) {
            printf("get char something wrong: %i", p_data->read.status);
            scan_complete = true;
            break;
        }
        ESP_LOGI(GATTC_TAG, "GET CHAR: conn_id = %x, status %d\n", p_data->read.conn_id, p_data->read.status);
        // ESP_LOGI(GATTC_TAG, "GET CHAR: srvc_id = %04x, char_id = %04x\n", p_data->read.srvc_id.id.uuid.uuid.uuid16, p_data->read.char_id.uuid.uuid.uuid16);

        // charracteristics[charracteristics_found++].id = p_data->read.char_id.uuid.uuid.uuid16;

        // esp_ble_gattc_get_characteristic(gattc_if, p_data->read.conn_id, &search_service_id, &p_data->read.char_id);
        break;
    case ESP_GATTC_WRITE_DESCR_EVT:
        ESP_LOGI(GATTC_TAG, "WRITE: status %d\n", p_data->write.status);
        break;
    case ESP_GATTC_WRITE_CHAR_EVT:
        ESP_LOGI(GATTC_TAG, "WRITE: status %d , conn_id: %x\n", p_data->write.status, p_data->write.conn_id);
        break;
    default:
        ESP_LOGI(GATTC_TAG, "unhandled event %d\n", event);
        break;
    }
}

// can i scan while i am connected ?
static void esp_gap_cb(esp_gap_ble_cb_event_t event, esp_ble_gap_cb_param_t *param) {
    switch (event) {
    case ESP_GAP_BLE_SCAN_PARAM_SET_COMPLETE_EVT: 
        printf("scan param set complete, scanning...\n");
        devices_found = 0;
        scan_complete = false;
        break;
    case ESP_GAP_BLE_SCAN_RESULT_EVT: {
        esp_ble_gap_cb_param_t *scan_result = (esp_ble_gap_cb_param_t *)param;
        if (scan_result->scan_rst.search_evt == ESP_GAP_SEARCH_INQ_RES_EVT) { 
              // forward beacon to MQTT
              uint8_t *addr = scan_result->scan_rst.bda;
              if (find_device(addr) == -1) {
                char mac[18];
                sprintf(mac, "%02X:%02X:%02X:%02X:%02X:%02X", addr[0], addr[1], addr[2], addr[3], addr[4], addr[5]);
                int rssi = scan_result->scan_rst.rssi;
                uint8_t *adv_name = NULL;
                uint8_t adv_name_len = 0;
                adv_name = esp_ble_resolve_adv_data(scan_result->scan_rst.ble_adv, ESP_BLE_AD_TYPE_NAME_CMPL, &adv_name_len);
                char name[50];
                printf("\n\n%i\n\n", adv_name_len);
                strncpy(name, (const char*)adv_name, adv_name_len);
                name[adv_name_len] = 0;
                printf("Device '%s' : %s, RSSI=%i\n", name, mac, rssi);
                memcpy(devices[devices_found].mac, addr, 6);
                strcpy(devices[devices_found++].name, name);
              }

        } else if (scan_result->scan_rst.search_evt == ESP_GAP_SEARCH_INQ_CMPL_EVT) {
              // scan params must be reset before starting another scan
              scan_complete = true;
              printf("scan completed...\n");
              printf("found %i devices\n", devices_found);
          
        }
        break;
    }
    default:
        break;
    }
}

void ble_client_appRegister(void)
{
    esp_err_t status;

    printf("register callback\n");

    // register the scan callback function to the gap module
    if ((status = esp_ble_gap_register_callback(esp_gap_cb)) != ESP_OK) {
        printf("ERROR: gap register error, error code = %x\n", status);
        return;
    }

    if ((status = esp_ble_gattc_register_callback(esp_gattc_cb)) != ESP_OK) {
        ESP_LOGE(GATTC_TAG, "gattc register error, error code = %x\n", status);
        return;
    }

    esp_ble_gap_set_scan_params(&ble_scan_params);
    // what are this app ids for ? what happens if i register multiple ?
    esp_ble_gattc_app_register(1);
}


BlueTooth::BlueTooth() {

}

bool btStart(){
    esp_bt_controller_config_t cfg = BT_CONTROLLER_INIT_CONFIG_DEFAULT();
    if(esp_bt_controller_get_status() == ESP_BT_CONTROLLER_STATUS_ENABLED){
        return true;
    }
    if(esp_bt_controller_get_status() == ESP_BT_CONTROLLER_STATUS_IDLE){
        esp_bt_controller_init(&cfg);
        while(esp_bt_controller_get_status() == ESP_BT_CONTROLLER_STATUS_IDLE){}
    }
    if(esp_bt_controller_get_status() == ESP_BT_CONTROLLER_STATUS_INITED){
        if (esp_bt_controller_enable(ESP_BT_MODE_BTDM)) {
            ESP_LOGE(GATTC_TAG, "BT Enable failed");
            return false;
        }
    }
    if(esp_bt_controller_get_status() == ESP_BT_CONTROLLER_STATUS_ENABLED){
        return true;
    }
    ESP_LOGE(GATTC_TAG, "BT Start failed");
    return false;
}

void BlueTooth::init() {
  ESP_LOGI(GATTC_TAG, "init bluetooth");
  if (!btStart()) {
    return;
  }
  esp_bluedroid_init();
  esp_bluedroid_enable();
  ble_client_appRegister();

  vTaskDelay(5000 / portTICK_PERIOD_MS);
  load_preset_devices();

}

void BlueTooth::deinit() {

}

void (*scan_complete_func)(uint16_t packet_id, void* data, uint16_t data_len);
uint8_t scan_type = 0;
uint16_t scan_packet_id = 0;
xTaskHandle wait_for_scan_complete_task_handle;
void wait_for_scan_complete(void* pvParameterspvParameters) {
  while(!scan_complete) {
      vTaskDelay(1000 / portTICK_PERIOD_MS);
  };

  printf("scan complete yey %i\n", sizeof(devices));

  switch (scan_type) {
    case 1:
      scan_complete_func(scan_packet_id, (void*)devices, sizeof(ble_device)*devices_found);
      break;
    case 2:
      scan_complete_func(scan_packet_id, (void*)services, sizeof(ble_service)*services_found);
      break;
    case 3:
      scan_complete_func(scan_packet_id, (void*)charracteristics, sizeof(ble_charracteristics)*charracteristics_found);
      break;
  }

  scan_type = 0;

  vTaskDelete(NULL);
}


void BlueTooth::getDevices(void(* func)(uint16_t packet_id, void* devices, uint16_t data_len), uint16_t packet_id) {
  printf("starting scan for bluetooth devices ...\n");
  esp_ble_gap_start_scanning(8);
  scan_type = 1;
  scan_packet_id = packet_id;
  scan_complete_func = func;
  scan_complete = false;
  xTaskCreate(&wait_for_scan_complete, "wait_for_scan_complete", 2048, NULL, 5, NULL);
}

void BlueTooth::getServices(uint8_t mac[6], void(* func)(uint16_t packet_id, void* devices, uint16_t data_len), uint16_t packet_id) {
  printf("starting scan for bluetooth services on %x:%x:%x:%x:%x:%x... [gattc_if: %i] \n", mac[0], mac[1], mac[2], mac[3], mac[4], mac[5], gatt_if);
  esp_ble_gattc_open(gatt_if, mac, (esp_ble_addr_type_t)0, true);
  if (!find_connected_device(mac)) esp_ble_gattc_open(gatt_if, mac, (esp_ble_addr_type_t)0, true);
  uint8_t i = find_connected_device(mac);
  uint16_t conn_id = connected_devices[i].conn_id;
  esp_ble_gattc_search_service(gatt_if, conn_id, NULL);
  scan_type = 2;
  scan_packet_id = packet_id;
  scan_complete_func = func;
  scan_complete = false;
  xTaskCreate(&wait_for_scan_complete, "wait_for_scan_complete", 2048, NULL, 5, NULL);
}

void BlueTooth::getCharracteristics(uint8_t mac[6], uint16_t service, void(* func)(uint16_t packet_id, void* devices, uint16_t data_len), uint16_t packet_id) {
  printf("starting scan for bluetooth charracteristics ... %x\n", service);
  search_service_id.id.uuid.uuid.uuid16 = service;
  if (!find_connected_device(mac)) esp_ble_gattc_open(gatt_if, mac, (esp_ble_addr_type_t)0, true);
  uint8_t i = find_connected_device(mac);
  uint16_t conn_id = connected_devices[i].conn_id;
  //esp_ble_gattc_get_characteristic(gatt_if, conn_id, &search_service_id, NULL);
  scan_complete = false;
  xTaskCreate(&wait_for_scan_complete, "wait_for_scan_complete", 2048, NULL, 5, NULL);
}

void BlueTooth::setValue(uint8_t mac[6], uint16_t service, uint16_t charracteristic, uint8_t* data, uint8_t data_len) {
  printf("writing value to ... %x:%x ::", service, charracteristic);
  for (int i = 0; i < data_len; i++) printf(":%x", data[i]);
  printf("\n");
  search_service_id.id.uuid.uuid.uuid16 = service;
  write_charracteristic_id.uuid.uuid.uuid16 = charracteristic;
  if (!find_connected_device(mac)) esp_ble_gattc_open(gatt_if, mac, (esp_ble_addr_type_t)0, true);
  uint8_t i = find_connected_device(mac);
  uint16_t conn_id = connected_devices[i].conn_id;
  esp_ble_gattc_write_char(
          gatt_if,
          conn_id,
          charracteristic,
          data_len,
          (uint8_t *)data,
          ESP_GATT_WRITE_TYPE_RSP,
          ESP_GATT_AUTH_REQ_NONE);
}

/*bool BlueTooth::addDevice(uint8_t mac[6], uint16_t service, uint16_t charracteristic, char* format) {
  for (int i = 0; i < sizeof(connected_devices); i++) {
    if (memcmp(connected_devices[i].mac, "\x00\x00\x00\x00\x00\x00", 6)) {
      memcpy(connected_devices[i].mac, mac, 6);
      strncpy(connected_devices[i].data_format, format, 20);
      connected_devices[i].service_id = service;
      connected_devices[i].characteristic_id = charracteristic;
      esp_ble_gattc_open(gatt_if, mac, true);
      return true;
    }
  }
  return false;
}

void BlueTooth::removeDevice(uint8_t mac[6]) {
  int i = find_connected_device(mac);
  esp_ble_gattc_close(gatt_if, connected_devices[i].conn_id);
  connected_devices[i].mac[0] = 0;
  connected_devices[i].mac[1] = 0;
  connected_devices[i].mac[2] = 0;
  connected_devices[i].mac[3] = 0;
  connected_devices[i].mac[4] = 0;
  connected_devices[i].mac[5] = 0;
}*/

void replacechar(char *str, uint8_t len, char orig, char rep) {
    char *ix = str;
    for(int i = 0; i < len; i++) {
      if (str[i] == orig) {
        str[i] = rep;
      }
    }
}

char sum(char *str, uint8_t start, uint8_t end) {
  char sum = 0;
  for (uint8_t i = start; i < end; i++) {
    sum = (sum + str[i]) & 0xff ;
  }
  return sum;
}

void BlueTooth::bt_light_on() {
  printf("$");
  for (int i = 0; i < 5; i++) {
    char command[30];
    if (connected_devices[i].service_id == 0) continue;
    connected_devices[i].format_data(command, 255, 255, 255, 255);
    setValue(connected_devices[i].mac, connected_devices[i].service_id, connected_devices[i].characteristic_id, (uint8_t*)command, connected_devices[i].data_length);
    //vTaskDelay(10 / portTICK_PERIOD_MS);
  }
}

void BlueTooth::bt_light_off() {
  printf("#");
  for (int i = 0; i < 5; i++) {
    char command[30];
    if (connected_devices[i].service_id == 0) continue;
    connected_devices[i].format_data(command, 0, 0, 0, 0);
    setValue(connected_devices[i].mac, connected_devices[i].service_id, connected_devices[i].characteristic_id, (uint8_t*)command, connected_devices[i].data_length);
    //vTaskDelay(10 / portTICK_PERIOD_MS);
  }
}

void BlueTooth::bt_light_level(uint8_t level) {
  /*for (int i = 0; i < 5; i++) {
    char command[30];
    if (connected_devices[i].service_id == 0) break;
    memcpy(command, connected_devices[i].data_format, 16);
    replacechar(command, 16, 'R', 0);
    replacechar(command, 16, 'G', 0);
    replacechar(command, 16, 'B', 0);
    replacechar(command, 16, 'W', level);
    setValue(connected_devices[i].mac, connected_devices[i].service_id, connected_devices[i].characteristic_id, (uint8_t*)command, 16);
  }*/
}
