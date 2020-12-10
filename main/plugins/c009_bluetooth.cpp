
#include "c009_bluetooth.h"

//#ifdef CONFIG_BT_ENABLED

#include "../lib/rule_engine.h"
#include "../lib/config.h"


static const char *TAG = "BlueToothPlugin";

extern Plugin* active_plugins[50];
extern Config* g_cfg;

PLUGIN_CONFIG(BlueToothPlugin, bleEnabled, beaconEnabled)
PLUGIN_STATS(BlueToothPlugin, state, state)

#define GATTS_TAG "GATTS_DEMO"
#define GATTC_TAG "GATTC_DEMO"

///Declare the static function
static void gatts_profile_a_event_handler(esp_gatts_cb_event_t event, esp_gatt_if_t gatts_if, esp_ble_gatts_cb_param_t *param);
// static void gatts_profile_b_event_handler(esp_gatts_cb_event_t event, esp_gatt_if_t gatts_if, esp_ble_gatts_cb_param_t *param);

// #define GATTS_SERVICE_UUID_TEST_A   0x00FF
// #define GATTS_CHAR_UUID_TEST_A      0xFF01
// #define GATTS_DESCR_UUID_TEST_A     0x3333
#define GATTS_NUM_HANDLE_TEST_A     4

// #define GATTS_SERVICE_UUID_TEST_B   0x00EE
// #define GATTS_CHAR_UUID_TEST_B      0xEE01
// #define GATTS_DESCR_UUID_TEST_B     0x2222
// #define GATTS_NUM_HANDLE_TEST_B     4

#define TEST_MANUFACTURER_DATA_LEN  17

#define PREPARE_BUF_MAX_SIZE 255

static esp_gatt_char_prop_t a_property = 0;
// static esp_gatt_char_prop_t b_property = 0;

static uint8_t adv_config_done = 0;
#define adv_config_flag      (1 << 0)
#define scan_rsp_config_flag (1 << 1)

// #ifdef CONFIG_SET_RAW_ADV_DATA
static uint8_t raw_adv_data[32] = {};
// static uint8_t raw_scan_rsp_data[] = {
//         0x0f, 0x09, 0x45, 0x53, 0x50, 0x5f, 0x47, 0x41, 0x54, 0x54, 0x53, 0x5f, 0x44,
//         0x45, 0x4d, 0x4f
// };
// #else

static uint8_t adv_service_uuid128[32] = {
    /* LSB <--------------------------------------------------------------------------------> MSB */
    //first uuid, 16bit, [12],[13] is the value
    0xfb, 0x34, 0x9b, 0x5f, 0x80, 0x00, 0x00, 0x80, 0x00, 0x10, 0x00, 0x00, 0xEE, 0x00, 0x00, 0x00,
    //second uuid, 32bit, [12], [13], [14], [15] is the value
    0xfb, 0x34, 0x9b, 0x5f, 0x80, 0x00, 0x00, 0x80, 0x00, 0x10, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00,
};

// The length of adv data must be less than 31 bytes
//static uint8_t test_manufacturer[TEST_MANUFACTURER_DATA_LEN] =  {0x12, 0x23, 0x45, 0x56};
//adv data
static esp_ble_adv_data_t adv_data = {
    .set_scan_rsp = false,
    .include_name = true,
    .include_txpower = true,
    .min_interval = 0x0006, //slave connection min interval, Time = min_interval * 1.25 msec
    .max_interval = 0x0010, //slave connection max interval, Time = max_interval * 1.25 msec
    .appearance = 0x00,
    .manufacturer_len = 0, //TEST_MANUFACTURER_DATA_LEN,
    .p_manufacturer_data =  NULL, //&test_manufacturer[0],
    .service_data_len = 0,
    .p_service_data = NULL,
    .service_uuid_len = sizeof(adv_service_uuid128),
    .p_service_uuid = adv_service_uuid128,
    .flag = (ESP_BLE_ADV_FLAG_GEN_DISC | ESP_BLE_ADV_FLAG_BREDR_NOT_SPT),
};


static esp_ble_scan_params_t ble_scan_params = {
    .scan_type              = BLE_SCAN_TYPE_ACTIVE,
    .own_addr_type          = BLE_ADDR_TYPE_PUBLIC,
    .scan_filter_policy     = BLE_SCAN_FILTER_ALLOW_ALL,
    .scan_interval          = 0x50,
    .scan_window            = 0x30,
    .scan_duplicate         = BLE_SCAN_DUPLICATE_DISABLE
};

// scan response data
static esp_ble_adv_data_t scan_rsp_data = {
    .set_scan_rsp = true,
    .include_name = true,
    .include_txpower = true,
    .min_interval = 0x0006,
    .max_interval = 0x0010,
    .appearance = 0x00,
    .manufacturer_len = 0, //TEST_MANUFACTURER_DATA_LEN,
    .p_manufacturer_data =  NULL, //&test_manufacturer[0],
    .service_data_len = 0,
    .p_service_data = NULL,
    .service_uuid_len = sizeof(adv_service_uuid128),
    .p_service_uuid = adv_service_uuid128,
    .flag = (ESP_BLE_ADV_FLAG_GEN_DISC | ESP_BLE_ADV_FLAG_BREDR_NOT_SPT),
};

// #endif /* CONFIG_SET_RAW_ADV_DATA */

static esp_ble_adv_params_t adv_params = {};

#define PROFILE_NUM 1
#define PROFILE_A_APP_ID 0
#define PROFILE_B_APP_ID 0

struct gatts_char {
    uint16_t char_handle;
    esp_bt_uuid_t char_uuid;
    esp_gatt_perm_t perm;
    esp_gatt_char_prop_t property;
    esp_attr_value_t value;
    uint16_t descr_handle;
    esp_bt_uuid_t descr_uuid;
};

struct gatts_service {
    uint16_t service_handle;
    esp_gatt_srvc_id_t service_id;
    struct gatts_char *chars;
    uint8_t chars_len;
};

struct gatts_profile_inst {
    esp_gatts_cb_t gatts_cb;
    uint16_t gatts_if;
    uint16_t app_id;
    uint16_t conn_id;
    struct gatts_service *services;
};

struct gattc_profile_inst {
    esp_gattc_cb_t gattc_cb;
    uint16_t gattc_if;
    uint16_t app_id;
    uint16_t conn_id;
    uint16_t service_start_handle;
    uint16_t service_end_handle;
    uint16_t char_handle;
    esp_bd_addr_t remote_bda;
};


/* One gatt-based profile one app_id and one gatts_if, this array will store the gatts_if returned by ESP_GATTS_REG_EVT */
static struct gatts_profile_inst gl_profile_tab[PROFILE_NUM] = {};
static struct gattc_profile_inst client_profile_tab[1] = {};

typedef struct {
    uint8_t                 *prepare_buf;
    int                     prepare_len;
} prepare_type_env_t;

static prepare_type_env_t a_prepare_write_env;
static prepare_type_env_t b_prepare_write_env;

void example_write_event_env(esp_gatt_if_t gatts_if, prepare_type_env_t *prepare_write_env, esp_ble_gatts_cb_param_t *param);
void example_exec_write_event_env(prepare_type_env_t *prepare_write_env, esp_ble_gatts_cb_param_t *param);

typedef struct {
    uint8_t bda[6];
    char name[50];
    int16_t rssi;
} scan_result_t;

static scan_result_t scan_results[10];

scan_result_t* find_scan_result(esp_bd_addr_t bda) {
    for (int i = 0; i < 10; i++) {
        if (memcmp(scan_results[i].bda, bda, 6) == 0) {
            return &scan_results[i];
        }
        if (scan_results[i].bda[0] == 0 && scan_results[i].bda[1] == 0 && scan_results[i].bda[2] == 0 &&
            scan_results[i].bda[3] == 0 && scan_results[i].bda[4] == 0 && scan_results[i].bda[5] == 0) {
            memcpy(scan_results[i].bda, bda, 6);
            scan_results[i].rssi = -1000;
            return &scan_results[i];
        }
    }

    return nullptr;
}

void clear_scan_results() {
    for (int i = 0; i < 10; i++) {
        for (int j = 0; j < 6; j++) scan_results[i].bda[j] = 0;
        scan_results[i].name[0] = 0;
        scan_results[i].rssi = 0;
    }
}

static void gap_event_handler(esp_gap_ble_cb_event_t event, esp_ble_gap_cb_param_t *param)
{
    uint8_t *adv_name = NULL;
    uint8_t adv_name_len = 0;
    switch (event) {
    case ESP_GAP_BLE_SCAN_PARAM_SET_COMPLETE_EVT: {
         //the unit of the duration is second
         uint32_t duration = 15;
         esp_ble_gap_start_scanning(duration);
         clear_scan_results();
         break;
     }
     case ESP_GAP_BLE_SCAN_START_COMPLETE_EVT:
         //scan start complete event to indicate scan start successfully or failed
         if (param->scan_start_cmpl.status != ESP_BT_STATUS_SUCCESS) {
             ESP_LOGE(GATTC_TAG, "scan start failed, error status = %x", param->scan_start_cmpl.status);
             break;
         }
         ESP_LOGI(GATTC_TAG, "scan start success");

         break;
     case ESP_GAP_BLE_SCAN_RESULT_EVT: {
        ESP_LOGI(GATTC_TAG, "scan result event");
         esp_ble_gap_cb_param_t *scan_result = (esp_ble_gap_cb_param_t *)param;
         switch (scan_result->scan_rst.search_evt) {
         case ESP_GAP_SEARCH_INQ_RES_EVT: {
             //esp_log_buffer_hex(GATTC_TAG, scan_result->scan_rst.bda, 6);
             ESP_LOGI(GATTC_TAG, "found device at %02x:%02x:%02x:%02x:%02x:%02x: type: %d, rssi: %d, nr: %d",
                scan_result->scan_rst.bda[0], scan_result->scan_rst.bda[1], scan_result->scan_rst.bda[2],
                scan_result->scan_rst.bda[3], scan_result->scan_rst.bda[4], scan_result->scan_rst.bda[5],
                scan_result->scan_rst.dev_type, scan_result->scan_rst.rssi, scan_result->scan_rst.num_resps);


             scan_result_t* result = find_scan_result(scan_result->scan_rst.bda);
             if (result->rssi < scan_result->scan_rst.rssi) {
                result->rssi = scan_result->scan_rst.rssi;
             }

             ESP_LOGI(GATTC_TAG, "searched Adv Data Len %d, Scan Response Len %d", scan_result->scan_rst.adv_data_len, scan_result->scan_rst.scan_rsp_len);
             adv_name = esp_ble_resolve_adv_data(scan_result->scan_rst.ble_adv, ESP_BLE_AD_TYPE_NAME_CMPL, &adv_name_len);
             ESP_LOGI(GATTC_TAG, "searched Device Name Len %d", adv_name_len);
             esp_log_buffer_char(GATTC_TAG, adv_name, adv_name_len);

             memcpy(result->name, adv_name, adv_name_len);

             ESP_LOGI(GATTC_TAG, "\n");
             break;
         } case ESP_GAP_SEARCH_INQ_CMPL_EVT:
             ESP_LOGI(GATTC_TAG, "scan complete");
             break;
         default:
             break;
         }
         break;
     }


// #ifdef CONFIG_SET_RAW_ADV_DATA
    case ESP_GAP_BLE_ADV_DATA_RAW_SET_COMPLETE_EVT:
        adv_config_done &= (~adv_config_flag);
        if (adv_config_done==0){
            esp_ble_gap_start_advertising(&adv_params);
        }
        break;
    case ESP_GAP_BLE_SCAN_RSP_DATA_RAW_SET_COMPLETE_EVT:
        adv_config_done &= (~scan_rsp_config_flag);
        if (adv_config_done==0){
            esp_ble_gap_start_advertising(&adv_params);
        }
        break;
// #else
    // case ESP_GAP_BLE_ADV_DATA_SET_COMPLETE_EVT:
    //     adv_config_done &= (~adv_config_flag);
    //     if (adv_config_done == 0){
    //         esp_ble_gap_start_advertising(&adv_params);
    //     }
    //     break;
    // case ESP_GAP_BLE_SCAN_RSP_DATA_SET_COMPLETE_EVT:
    //     adv_config_done &= (~scan_rsp_config_flag);
    //     if (adv_config_done == 0){
    //         esp_ble_gap_start_advertising(&adv_params);
    //     }
    //     break;
// #endif
    case ESP_GAP_BLE_ADV_START_COMPLETE_EVT:
        //advertising start complete event to indicate advertising start successfully or failed
        if (param->adv_start_cmpl.status != ESP_BT_STATUS_SUCCESS) {
            ESP_LOGE(GATTS_TAG, "Advertising start failed\n");
        }
        break;
    case ESP_GAP_BLE_SCAN_STOP_COMPLETE_EVT:
        if (param->scan_stop_cmpl.status != ESP_BT_STATUS_SUCCESS){
            ESP_LOGE(GATTC_TAG, "scan stop failed, error status = %x", param->scan_stop_cmpl.status);
            break;
        }
        ESP_LOGI(GATTC_TAG, "stop scan successfully");
        break;
    case ESP_GAP_BLE_ADV_STOP_COMPLETE_EVT:
        if (param->adv_stop_cmpl.status != ESP_BT_STATUS_SUCCESS) {
            ESP_LOGE(GATTS_TAG, "Advertising stop failed\n");
            break;
        }
        ESP_LOGI(GATTS_TAG, "Stop adv successfully\n");

        break;
    case ESP_GAP_BLE_UPDATE_CONN_PARAMS_EVT:
         ESP_LOGI(GATTS_TAG, "update connection params status = %d, min_int = %d, max_int = %d,conn_int = %d,latency = %d, timeout = %d",
                  param->update_conn_params.status,
                  param->update_conn_params.min_int,
                  param->update_conn_params.max_int,
                  param->update_conn_params.conn_int,
                  param->update_conn_params.latency,
                  param->update_conn_params.timeout);
        break;
    default:
        break;
    }
}

void find_serv_handle(uint8_t handle, uint8_t *service_id) {
    for (int i = 0; i < 1 /*sizeof(gl_profile_tab[PROFILE_A_APP_ID].services)*/; i++) {
        if (gl_profile_tab[PROFILE_A_APP_ID].services[i].service_handle == handle) {
            *service_id = i;
            return;
        }
    }
}

void find_char_handle(uint8_t handle, uint8_t *char_id, uint8_t *service_id) {
    for (int i = 0; i < 1 /*sizeof(gl_profile_tab[PROFILE_A_APP_ID].services)*/; i++) {
        for (int j = 0; j < gl_profile_tab[PROFILE_A_APP_ID].services[i].chars_len; j++) {
            ESP_LOGI(GATTS_TAG, "looking for handle %d in s%d c%d", handle, i, j);
            if (gl_profile_tab[PROFILE_A_APP_ID].services[i].chars[j].char_handle == handle) {
                *char_id = j;
                *service_id = i;
                return;
            }
        }
    }
}

void example_write_event_env(esp_gatt_if_t gatts_if, prepare_type_env_t *prepare_write_env, esp_ble_gatts_cb_param_t *param){
    esp_gatt_status_t status = ESP_GATT_OK;
    if (param->write.need_rsp){
        if (param->write.is_prep){
            ESP_LOGI(GATTS_TAG, "is prep");
            // if (prepare_write_env->prepare_buf == NULL) {
            //     prepare_write_env->prepare_buf = (uint8_t *)malloc(PREPARE_BUF_MAX_SIZE*sizeof(uint8_t));
            //     prepare_write_env->prepare_len = 0;
            //     if (prepare_write_env->prepare_buf == NULL) {
            //         ESP_LOGE(GATTS_TAG, "Gatt_server prep no mem\n");
            //         status = ESP_GATT_NO_RESOURCES;
            //     }
            // } else {
            //     if(param->write.offset > PREPARE_BUF_MAX_SIZE) {
            //         status = ESP_GATT_INVALID_OFFSET;
            //     } else if ((param->write.offset + param->write.len) > PREPARE_BUF_MAX_SIZE) {
            //         status = ESP_GATT_INVALID_ATTR_LEN;
            //     }
            // }

            // esp_gatt_rsp_t *gatt_rsp = (esp_gatt_rsp_t *)malloc(sizeof(esp_gatt_rsp_t));
            // gatt_rsp->attr_value.len = param->write.len;
            // gatt_rsp->attr_value.handle = param->write.handle;
            // gatt_rsp->attr_value.offset = param->write.offset;
            // gatt_rsp->attr_value.auth_req = ESP_GATT_AUTH_REQ_NONE;
            // memcpy(gatt_rsp->attr_value.value, param->write.value, param->write.len);
            // esp_err_t response_err = esp_ble_gatts_send_response(gatts_if, param->write.conn_id, param->write.trans_id, status, gatt_rsp);
            // if (response_err != ESP_OK){
            //    ESP_LOGE(GATTS_TAG, "Send response error\n");
            // }
            // free(gatt_rsp);
            // if (status != ESP_GATT_OK){
            //     return;
            // }
            // memcpy(prepare_write_env->prepare_buf + param->write.offset,
            //        param->write.value,
            //        param->write.len);
            // prepare_write_env->prepare_len += param->write.len;

        }else{
            ESP_LOGI(GATTS_TAG, "no prep");
            uint8_t char_id = 0;
            uint8_t service_id = 0;
            find_char_handle(param->write.handle, &char_id, &service_id);
            memcpy(gl_profile_tab[PROFILE_A_APP_ID].services[service_id].chars[char_id].value.attr_value, param->write.value, param->write.len);
            esp_ble_gatts_send_response(gatts_if, param->write.conn_id, param->write.trans_id, status, NULL);
            if (rule_engine_bluetooth_triggers[char_id] != nullptr) {
                ESP_LOGI(TAG, "running rule");
                run_rule(rule_engine_bluetooth_triggers[char_id], gl_profile_tab[PROFILE_A_APP_ID].services[service_id].chars[char_id].value.attr_value, param->write.len, 255);
            }
            
        }
    }
}

void example_exec_write_event_env(prepare_type_env_t *prepare_write_env, esp_ble_gatts_cb_param_t *param){
    if (param->exec_write.exec_write_flag == ESP_GATT_PREP_WRITE_EXEC){
        esp_log_buffer_hex(GATTS_TAG, prepare_write_env->prepare_buf, prepare_write_env->prepare_len);
    }else{
        ESP_LOGI(GATTS_TAG,"ESP_GATT_PREP_WRITE_CANCEL");
    }
    if (prepare_write_env->prepare_buf) {

        free(prepare_write_env->prepare_buf);
        prepare_write_env->prepare_buf = NULL;
    }
    prepare_write_env->prepare_len = 0;
}

#define MIN(x, y) ((x > y) ? y : x);
#define MAX(x, y) ((x > y) ? x : y);

bool bluetoothConnectionReady = false;
bool bluetoothDataReady = false;
uint8_t* bluetoothData;
uint8_t bluetoothDataLength;

static void gatts_profile_b_event_handler(esp_gattc_cb_event_t event, esp_gatt_if_t gattc_if, esp_ble_gattc_cb_param_t *param) {
    switch (event) {
    case ESP_GATTC_CONNECT_EVT: {
       ESP_LOGI(GATTC_TAG, "ESP_GATTC_CONNECT_EVT conn_id %d, if %d", param->connect.conn_id, gattc_if);
       client_profile_tab[PROFILE_B_APP_ID].conn_id = param->connect.conn_id;
       memcpy(client_profile_tab[PROFILE_B_APP_ID].remote_bda, param->connect.remote_bda, sizeof(esp_bd_addr_t));
       ESP_LOGI(GATTC_TAG, "REMOTE BDA:");
       esp_log_buffer_hex(GATTC_TAG, client_profile_tab[PROFILE_B_APP_ID].remote_bda, sizeof(esp_bd_addr_t));
       esp_err_t mtu_ret = esp_ble_gattc_send_mtu_req (gattc_if, param->connect.conn_id);
        break;
    }
    case ESP_GATTC_DIS_SRVC_CMPL_EVT:
        if (param->dis_srvc_cmpl.status != ESP_GATT_OK){
            ESP_LOGE(GATTC_TAG, "discover service failed, status %d", param->dis_srvc_cmpl.status);
            break;
        }
        ESP_LOGI(GATTC_TAG, "discover service complete conn_id %d", param->dis_srvc_cmpl.conn_id);
        bluetoothConnectionReady = true;
        //esp_ble_gattc_search_service(gattc_if, param->cfg_mtu.conn_id, &remote_filter_service_uuid);
        break;
    case ESP_GATTC_CFG_MTU_EVT:
        ESP_LOGI(GATTS_TAG, "ESP_GATTS_MTU_EVT, MTU %d", param->cfg_mtu.mtu);
        break;


    default:
        ESP_LOGI(GATTC_TAG, "event: %d ", event);
        break;
    }

}

static void gatts_profile_a_event_handler(esp_gatts_cb_event_t event, esp_gatt_if_t gatts_if, esp_ble_gatts_cb_param_t *param) {
    uint8_t current_char = 1;    
    switch (event) {
    case ESP_GATTS_REG_EVT: {
        ESP_LOGI(GATTS_TAG, "REGISTER_APP_EVT, status %d, app_id %d\n", param->reg.status, param->reg.app_id);
        
        esp_err_t set_dev_name_ret = esp_ble_gap_set_device_name(g_cfg->getUnitName());
        if (set_dev_name_ret){
            ESP_LOGE(GATTS_TAG, "set device name failed, error code = %x", set_dev_name_ret);
        }
// #ifdef CONFIG_SET_RAW_ADV_DATA
//         esp_err_t raw_adv_ret = esp_ble_gap_config_adv_data_raw(raw_adv_data, sizeof(raw_adv_data));
//         if (raw_adv_ret){
//             ESP_LOGE(GATTS_TAG, "config raw adv data failed, error code = %x ", raw_adv_ret);
//         }
//         adv_config_done |= adv_config_flag;
//         esp_err_t raw_scan_ret = esp_ble_gap_config_scan_rsp_data_raw(raw_scan_rsp_data, sizeof(raw_scan_rsp_data));
//         if (raw_scan_ret){
//             ESP_LOGE(GATTS_TAG, "config raw scan rsp data failed, error code = %x", raw_scan_ret);
//         }
//         adv_config_done |= scan_rsp_config_flag;
// #else
        //config adv data
        esp_err_t ret = esp_ble_gap_config_adv_data(&adv_data);
        if (ret){
            ESP_LOGE(GATTS_TAG, "config adv data failed, error code = %x", ret);
        }
        adv_config_done |= adv_config_flag;
        //config scan response data
        ret = esp_ble_gap_config_adv_data(&scan_rsp_data);
        if (ret){
            ESP_LOGE(GATTS_TAG, "config scan response data failed, error code = %x", ret);
        }
        adv_config_done |= scan_rsp_config_flag;

// #endif
        ESP_LOGI(GATTS_TAG, "sizeof services: %d  sizeof service: %d", sizeof(*gl_profile_tab[PROFILE_A_APP_ID].services), sizeof(gatts_service));
        for (uint8_t i = 0; i < sizeof(*gl_profile_tab[PROFILE_A_APP_ID].services)/sizeof(gatts_service); i++) {
            ESP_LOGI(GATTS_TAG, "registering service %d with id %d", i, gl_profile_tab[PROFILE_A_APP_ID].services[i].service_id.id.uuid.uuid.uuid16);
            esp_ble_gatts_create_service(gatts_if, &gl_profile_tab[PROFILE_A_APP_ID].services[i].service_id, 12);
        }
        
        break;
    }
    case ESP_GATTS_READ_EVT: {
        ESP_LOGI(GATTS_TAG, "GATT_READ_EVT, conn_id %d, trans_id %d, handle %d\n", param->read.conn_id, param->read.trans_id, param->read.handle);
        esp_gatt_rsp_t rsp;
        memset(&rsp, 0, sizeof(esp_gatt_rsp_t));
        rsp.attr_value.handle = param->read.handle;
        uint8_t char_id;
        uint8_t service_id;
        find_char_handle(param->read.handle, &char_id, &service_id);

        ESP_LOGI(GATTS_TAG, "reading service %d char %d", service_id, char_id);
        rsp.attr_value.len = 1;
        rsp.attr_value.value[0] = gl_profile_tab[PROFILE_A_APP_ID].services[service_id].chars[char_id].value.attr_value[0];
        esp_ble_gatts_send_response(gatts_if, param->read.conn_id, param->read.trans_id,
                                    ESP_GATT_OK, &rsp);
        break;
    }
    case ESP_GATTS_WRITE_EVT: {
        ESP_LOGI(GATTS_TAG, "GATT_WRITE_EVT, conn_id %d, trans_id %d, handle %d", param->write.conn_id, param->write.trans_id, param->write.handle);
        if (!param->write.is_prep){
            ESP_LOGI(GATTS_TAG, "GATT_WRITE_EVT, value len %d, value :", param->write.len);
            esp_log_buffer_hex(GATTS_TAG, param->write.value, param->write.len);
            // if (gl_profile_tab[PROFILE_A_APP_ID].descr_handle == param->write.handle && param->write.len == 2){
            //     uint16_t descr_value = param->write.value[1]<<8 | param->write.value[0];
            //     if (descr_value == 0x0001){
            //         if (a_property & ESP_GATT_CHAR_PROP_BIT_NOTIFY){
            //             ESP_LOGI(GATTS_TAG, "notify enable");
            //             uint8_t notify_data[15];
            //             for (int i = 0; i < sizeof(notify_data); ++i)
            //             {
            //                 notify_data[i] = i%0xff;
            //             }
            //             //the size of notify_data[] need less than MTU size
            //             esp_ble_gatts_send_indicate(gatts_if, param->write.conn_id, gl_profile_tab[PROFILE_A_APP_ID].char_handle,
            //                                     sizeof(notify_data), notify_data, false);
            //         }
            //     }else if (descr_value == 0x0002){
            //         if (a_property & ESP_GATT_CHAR_PROP_BIT_INDICATE){
            //             ESP_LOGI(GATTS_TAG, "indicate enable");
            //             uint8_t indicate_data[15];
            //             for (int i = 0; i < sizeof(indicate_data); ++i)
            //             {
            //                 indicate_data[i] = i%0xff;
            //             }
            //             //the size of indicate_data[] need less than MTU size
            //             esp_ble_gatts_send_indicate(gatts_if, param->write.conn_id, gl_profile_tab[PROFILE_A_APP_ID].char_handle,
            //                                     sizeof(indicate_data), indicate_data, true);
            //         }
            //     }
            //     else if (descr_value == 0x0000){
            //         ESP_LOGI(GATTS_TAG, "notify/indicate disable ");
            //     }else{
            //         ESP_LOGE(GATTS_TAG, "unknown descr value");
            //         esp_log_buffer_hex(GATTS_TAG, param->write.value, param->write.len);
            //     }

            // }
        }
        example_write_event_env(gatts_if, &a_prepare_write_env, param);
        break;
    }
    case ESP_GATTS_EXEC_WRITE_EVT:
        ESP_LOGI(GATTS_TAG,"ESP_GATTS_EXEC_WRITE_EVT");
        esp_ble_gatts_send_response(gatts_if, param->write.conn_id, param->write.trans_id, ESP_GATT_OK, NULL);
        example_exec_write_event_env(&a_prepare_write_env, param);
        break;
    case ESP_GATTS_MTU_EVT:
        ESP_LOGI(GATTS_TAG, "ESP_GATTS_MTU_EVT, MTU %d", param->mtu.mtu);
        break;
    case ESP_GATTS_UNREG_EVT:
        break;
    case ESP_GATTS_CREATE_EVT: {
        uint16_t sid = (uint16_t)param->create.service_id.id.uuid.uuid.uuid16;
        ESP_LOGI(GATTS_TAG, "CREATE_SERVICE_EVT, status %d,  service_handle %d, service_id %d\n", param->create.status, param->create.service_handle, sid);
        gl_profile_tab[PROFILE_A_APP_ID].services[sid].service_handle = param->create.service_handle;
        
        esp_ble_gatts_start_service(gl_profile_tab[PROFILE_A_APP_ID].services[sid].service_handle);

        for (int i = 0; i < gl_profile_tab[PROFILE_A_APP_ID].services[sid].chars_len; i++) {
            // uint8_t i = 0;
            current_char = 1;
            ESP_LOGI(GATTS_TAG, "creating characterinstic %d with shandle %d uuid %d value_len %d", i, gl_profile_tab[0].services[sid].service_handle, gl_profile_tab[0].services[sid].chars[i].char_uuid.uuid.uuid16, gl_profile_tab[PROFILE_A_APP_ID].services[sid].chars[i].value.attr_max_len);
            a_property = ESP_GATT_CHAR_PROP_BIT_READ | ESP_GATT_CHAR_PROP_BIT_WRITE;
            esp_err_t add_char_ret = esp_ble_gatts_add_char(gl_profile_tab[PROFILE_A_APP_ID].services[sid].service_handle, 
                                                            &gl_profile_tab[PROFILE_A_APP_ID].services[sid].chars[i].char_uuid,
                                                            ESP_GATT_PERM_READ | ESP_GATT_PERM_WRITE,
                                                            a_property,
                                                            &gl_profile_tab[PROFILE_A_APP_ID].services[sid].chars[i].value, 
                                                            NULL);
            if (add_char_ret){
                ESP_LOGE(GATTS_TAG, "add char failed, error code =%x",add_char_ret);
            }
        }
        
        break;
    }
    case ESP_GATTS_ADD_INCL_SRVC_EVT:
        break;
    case ESP_GATTS_ADD_CHAR_EVT: {
        // uint16_t length = 0;
        // const uint8_t *prf_char;
        uint8_t sid = 0;
        uint8_t cid = param->add_char.char_uuid.uuid.uuid16;
        find_serv_handle(param->add_char.service_handle, &sid);
        ESP_LOGI(GATTS_TAG, "ADD_CHAR_EVT, status %d,  attr_handle %d, service_handle %d\n",
                param->add_char.status, param->add_char.attr_handle, param->add_char.service_handle);
        gl_profile_tab[PROFILE_A_APP_ID].services[sid].chars[cid].char_handle = param->add_char.attr_handle;

        // if (current_char < gl_profile_tab[PROFILE_A_APP_ID].services[sid].chars_len) {
        //     ESP_LOGI(GATTS_TAG, "creating characterinstic %d with shandle %d uuid %d value_len %d", current_char, gl_profile_tab[0].services[sid].service_handle, gl_profile_tab[0].services[sid].chars[current_char].char_uuid.uuid.uuid16, gl_profile_tab[PROFILE_A_APP_ID].services[sid].chars[current_char].value.attr_max_len);
        //     a_property = ESP_GATT_CHAR_PROP_BIT_READ | ESP_GATT_CHAR_PROP_BIT_WRITE;
        //     esp_err_t add_char_ret = esp_ble_gatts_add_char(gl_profile_tab[PROFILE_A_APP_ID].services[sid].service_handle, 
        //                                                     &gl_profile_tab[PROFILE_A_APP_ID].services[sid].chars[current_char].char_uuid,
        //                                                     ESP_GATT_PERM_READ | ESP_GATT_PERM_WRITE,
        //                                                     a_property,
        //                                                     &gl_profile_tab[PROFILE_A_APP_ID].services[sid].chars[current_char].value, 
        //                                                     NULL);

        //     current_char++;
        //     if (add_char_ret){
        //         ESP_LOGE(GATTS_TAG, "add char failed, error code =%x",add_char_ret);
        //     }
        // }
        // gl_profile_tab[PROFILE_A_APP_ID].descr_uuid.len = ESP_UUID_LEN_16;
        // gl_profile_tab[PROFILE_A_APP_ID].descr_uuid.uuid.uuid16 = ESP_GATT_UUID_CHAR_CLIENT_CONFIG;
        // esp_err_t get_attr_ret = esp_ble_gatts_get_attr_value(param->add_char.attr_handle,  &length, &prf_char);
        // if (get_attr_ret == ESP_FAIL){
        //     ESP_LOGE(GATTS_TAG, "ILLEGAL HANDLE");
        // }

        // ESP_LOGI(GATTS_TAG, "the gatts demo char length = %x\n", length);
        // for(int i = 0; i < length; i++){
        //     ESP_LOGI(GATTS_TAG, "prf_char[%x] =%x\n",i,prf_char[i]);
        // }
        // esp_err_t add_descr_ret = esp_ble_gatts_add_char_descr(gl_profile_tab[PROFILE_A_APP_ID].service_handle, &gl_profile_tab[PROFILE_A_APP_ID].descr_uuid,
        //                                                         ESP_GATT_PERM_READ | ESP_GATT_PERM_WRITE, NULL, NULL);
        // if (add_descr_ret){
        //     ESP_LOGE(GATTS_TAG, "add char descr failed, error code =%x", add_descr_ret);
        // }
        break;
    }
    case ESP_GATTS_ADD_CHAR_DESCR_EVT:
        // gl_profile_tab[PROFILE_A_APP_ID].descr_handle = param->add_char_descr.attr_handle;
        // ESP_LOGI(GATTS_TAG, "ADD_DESCR_EVT, status %d, attr_handle %d, service_handle %d\n",
        //          param->add_char_descr.status, param->add_char_descr.attr_handle, param->add_char_descr.service_handle);
        break;
    case ESP_GATTS_DELETE_EVT:
        break;
    case ESP_GATTS_START_EVT:
        ESP_LOGI(GATTS_TAG, "SERVICE_START_EVT, status %d, service_handle %d\n",
                 param->start.status, param->start.service_handle);
        break;
    case ESP_GATTS_STOP_EVT:
        break;
    case ESP_GATTS_CONNECT_EVT: {
        esp_ble_conn_update_params_t conn_params = {0};
        memcpy(conn_params.bda, param->connect.remote_bda, sizeof(esp_bd_addr_t));
        /* For the IOS system, please reference the apple official documents about the ble connection parameters restrictions. */
        conn_params.latency = 0;
        conn_params.max_int = 0x20;    // max_int = 0x20*1.25ms = 40ms
        conn_params.min_int = 0x10;    // min_int = 0x10*1.25ms = 20ms
        conn_params.timeout = 400;    // timeout = 400*10ms = 4000ms
        ESP_LOGI(GATTS_TAG, "ESP_GATTS_CONNECT_EVT, conn_id %d, remote %02x:%02x:%02x:%02x:%02x:%02x:",
                 param->connect.conn_id,
                 param->connect.remote_bda[0], param->connect.remote_bda[1], param->connect.remote_bda[2],
                 param->connect.remote_bda[3], param->connect.remote_bda[4], param->connect.remote_bda[5]);
        gl_profile_tab[PROFILE_A_APP_ID].conn_id = param->connect.conn_id;
        //start sent the update connection parameters to the peer device.
        esp_ble_gap_update_conn_params(&conn_params);
        break;
    }
    case ESP_GATTS_DISCONNECT_EVT:
        ESP_LOGI(GATTS_TAG, "ESP_GATTS_DISCONNECT_EVT, disconnect reason 0x%x", param->disconnect.reason);
        esp_ble_gap_start_advertising(&adv_params);
        break;
    case ESP_GATTS_CONF_EVT:
        ESP_LOGI(GATTS_TAG, "ESP_GATTS_CONF_EVT, status %d attr_handle %d", param->conf.status, param->conf.handle);
        if (param->conf.status != ESP_GATT_OK){
            esp_log_buffer_hex(GATTS_TAG, param->conf.value, param->conf.len);
        }
        break;
    case ESP_GATTS_OPEN_EVT:
    case ESP_GATTS_CANCEL_OPEN_EVT:
    case ESP_GATTS_CLOSE_EVT:
    case ESP_GATTS_LISTEN_EVT:
    case ESP_GATTS_CONGEST_EVT:
    default:
        break;
    }
}

static void gatts_event_handler(esp_gatts_cb_event_t event, esp_gatt_if_t gatts_if, esp_ble_gatts_cb_param_t *param)
{
    /* If event is register event, store the gatts_if for each profile */
    if (event == ESP_GATTS_REG_EVT) {
        if (param->reg.status == ESP_GATT_OK) {
            gl_profile_tab[param->reg.app_id].gatts_if = gatts_if;
        } else {
            ESP_LOGI(GATTS_TAG, "Reg app failed, app_id %04x, status %d\n",
                    param->reg.app_id,
                    param->reg.status);
            return;
        }
    }

    /* If the gatts_if equal to profile A, call profile A cb handler,
     * so here call each profile's callback */
    do {
        int idx;
        for (idx = 0; idx < PROFILE_NUM; idx++) {
            if (gatts_if == ESP_GATT_IF_NONE || /* ESP_GATT_IF_NONE, not specify a certain gatt_if, need to call every profile cb function */
                    gatts_if == gl_profile_tab[idx].gatts_if) {
                if (gl_profile_tab[idx].gatts_cb) {
                    gl_profile_tab[idx].gatts_cb(event, gatts_if, param);
                }
            }
        }
    } while (0);
}

static void esp_gattc_cb(esp_gattc_cb_event_t event, esp_gatt_if_t gattc_if, esp_ble_gattc_cb_param_t *param)
{
    /* If event is register event, store the gattc_if for each profile */
    if (event == ESP_GATTC_REG_EVT) {
        if (param->reg.status == ESP_GATT_OK) {
            client_profile_tab[param->reg.app_id].gattc_if = gattc_if;
        } else {
            ESP_LOGI(GATTC_TAG, "reg app failed, app_id %04x, status %d",
                    param->reg.app_id,
                    param->reg.status);
            return;
        }
    }

    /* If the gattc_if equal to profile A, call profile A cb handler,
     * so here call each profile's callback */
    do {
        int idx;
        for (idx = 0; idx < PROFILE_NUM; idx++) {
            if (gattc_if == ESP_GATT_IF_NONE || /* ESP_GATT_IF_NONE, not specify a certain gatt_if, need to call every profile cb function */
                    gattc_if == client_profile_tab[idx].gattc_if) {
                if (client_profile_tab[idx].gattc_cb) {
                    client_profile_tab[idx].gattc_cb(event, gattc_if, param);
                }
            }
        }
    } while (0);
}

static int8_t level;
static int8_t lastLevel;
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

static void json_quote_val_prop(httpd_req_t *req, const char* val) {
  if (lastLevel == level) httpd_resp_sendstr_chunk(req, ",");
  httpd_resp_sendstr_chunk(req, "\"");
  httpd_resp_sendstr_chunk(req, val);
  httpd_resp_sendstr_chunk(req, "\"");
  lastLevel = level;
}

static void json_val_prop(httpd_req_t *req, const char* val) {
  if (lastLevel == level) httpd_resp_sendstr_chunk(req, ",");
  httpd_resp_sendstr_chunk(req, val);
  lastLevel = level;
}

static void json_quote_val(httpd_req_t *req, const char* val) {
  httpd_resp_sendstr_chunk(req, "\"");
  httpd_resp_sendstr_chunk(req, val);
  httpd_resp_sendstr_chunk(req, "\"");
}

static void json_val(httpd_req_t *req, const char* val) {
  httpd_resp_sendstr_chunk(req, val);
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
  httpd_resp_sendstr_chunk(req, value);
  lastLevel = level;
}

static void json_prop(httpd_req_t *req, const char* name, const char* value) {
  json_quote_name(req, name);
  json_quote_val(req, value);
  lastLevel = level;
}

static esp_err_t blescan_webhandler(httpd_req_t *req) {
    esp_err_t scan_ret = esp_ble_gap_set_scan_params(&ble_scan_params);
    if (scan_ret){
        ESP_LOGE(GATTC_TAG, "set scan params error, error code = %x", scan_ret);
    }

    // wait for scan to complete
    vTaskDelay(15000 / portTICK_PERIOD_MS);

    // return the results
    json_init();
    json_open(req, true);

    char name[5];
    for (uint8_t i = 0; i < 10; i++) {
        if (memcmp(scan_results[i].bda, "\0\0\0\0\0\0", 6) == 0) break;
        json_open(req);
        json_open(req, true, "bda");
        for(int j = 0; j < 6; j++) {
            sprintf(name, "%02x", scan_results[i].bda[j]);
            json_val_prop(req, name);
        }
        json_close(req, true);
        json_prop(req, "name",  scan_results[i].name[0] == 0 ? "-" : scan_results[i].name);
        sprintf(name, "%02x", scan_results[i].rssi);
        json_number(req, "rssi", name);
        json_close(req);
    }

    json_close(req, true);

    httpd_resp_sendstr_chunk(req, NULL);

    return ESP_OK;
}

// performs a scan for bluetooth LE devices
void BlueToothPlugin::scanDevices() {

}

// reads a device/service/char
bool semaphore = false;
void BlueToothPlugin::readDevice(esp_bd_addr_t addr, esp_bt_uuid_t service, esp_bt_uuid_t charr, char* result, uint8_t length) {
    if (semaphore) {
        ESP_LOGE(TAG, "already running!!");
        return;
    }
    semaphore = true;
    bluetoothConnectionReady = false;
    bluetoothDataReady = false;
    bluetoothData = (uint8_t*)result;
    bluetoothDataLength = length;

    esp_ble_gattc_open(client_profile_tab[PROFILE_B_APP_ID].gattc_if, addr, (esp_ble_addr_type_t)2, true);

    // semaphore connection open and discovery complete
    while (!bluetoothConnectionReady) {
        vTaskDelay( 100 / portTICK_PERIOD_MS);
    }

    esp_gattc_char_elem_t* char_elem_result = (esp_gattc_char_elem_t *)malloc(sizeof(esp_gattc_char_elem_t));
    uint16_t l = 1;
    esp_ble_gattc_get_char_by_uuid(client_profile_tab[PROFILE_B_APP_ID].gattc_if, client_profile_tab[PROFILE_B_APP_ID].conn_id, 0, 0xffff, charr, char_elem_result, &l);
    esp_ble_gattc_read_char(client_profile_tab[PROFILE_B_APP_ID].gattc_if, client_profile_tab[PROFILE_B_APP_ID].conn_id, char_elem_result[0].char_handle, ESP_GATT_AUTH_REQ_NONE);

    while(!bluetoothDataReady) {
        vTaskDelay( 100 / portTICK_PERIOD_MS);
    }

    semaphore = false;
}

// writes to device/service/char
void BlueToothPlugin::writeDevice() {

}

// adds a device/service/char to read periodically
void BlueToothPlugin::registerDevice() {

}

// bluetooth plugin
// enables bluetooth (config/bluetooth/enabled)
// enables bluetooth beacon, which can emit any device value (or TODO: name)
// enables bluetooth LE device with a list of services (values) that can be controlled
// exposes API for other plugins to connect to other bluetooth LE devices and capture beacons
bool BlueToothPlugin::init(JsonObject &params) {
    cfg = &((JsonObject &)params);
    state_cfg = &((JsonArray &)params["state"]);

    adv_params.adv_int_min = 0x20;
    adv_params.adv_int_max = 0x40;
    adv_params.adv_type = ADV_TYPE_IND;
    adv_params.own_addr_type = BLE_ADDR_TYPE_PUBLIC;
    adv_params.channel_map = ADV_CHNL_ALL;
    adv_params.adv_filter_policy = ADV_FILTER_ALLOW_SCAN_ANY_CON_ANY;

    if ((*cfg)["beacon"]["enabled"] == true) {
        if ((*cfg)["beacon"]["type"] == "custom") {
            JsonArray &vals = params["server"]["values"];// service["chars"];
            if (vals.size() == 0) {
                ESP_LOGW(GATTS_TAG, "no beacon info defined");
                return false;
            }

            strncpy((char*)raw_adv_data, g_cfg->getUnitName(), 12);
            raw_adv_data[11] = 0;
            uint8_t b = 12;
            for (auto v : vals) {
                uint8_t device = v["device"];
                uint8_t value = v["value"];
                Type t;
                void* ptr = active_plugins[device]->getStateVarPtr(value, &t);
                convert((char*)raw_adv_data + b, (Type)(t < 4 ? 4: t), ptr, t);
                b += t < 4 ? (t == 0 ? 1 : 4)  : t;
                //raw_adv_data[b++] = *ptr;
            }
        } else {
            // todo: name beacon

        }
    }
    
    ESP_ERROR_CHECK(esp_bt_controller_mem_release(ESP_BT_MODE_CLASSIC_BT)); // we are not using classic bt yet, so release the memory

    esp_bt_controller_config_t bt_cfg = BT_CONTROLLER_INIT_CONFIG_DEFAULT();
    esp_err_t ret = esp_bt_controller_init(&bt_cfg);
    if (ret) {
        ESP_LOGE(GATTS_TAG, "%s initialize controller failed: %s\n", __func__, esp_err_to_name(ret));
        return ESP_FAIL;
    }

    ret = esp_bt_controller_enable(ESP_BT_MODE_BLE);
    if (ret) {
        ESP_LOGE(GATTS_TAG, "%s enable controller failed: %s\n", __func__, esp_err_to_name(ret));
        return ESP_FAIL;
    }
    ret = esp_bluedroid_init();
    if (ret) {
        ESP_LOGE(GATTS_TAG, "%s init bluetooth failed: %s\n", __func__, esp_err_to_name(ret));
        return ESP_FAIL;
    }
    ret = esp_bluedroid_enable();
    if (ret) {
        ESP_LOGE(GATTS_TAG, "%s enable bluetooth failed: %s\n", __func__, esp_err_to_name(ret));
        return ESP_FAIL;
    }

    ret = esp_ble_gattc_register_callback(esp_gattc_cb);
    if (ret){
        ESP_LOGE(GATTS_TAG, "gattc register error, error code = %x", ret);
        return ESP_FAIL;
    }

    ret = esp_ble_gap_register_callback(gap_event_handler);
    if (ret){
        ESP_LOGE(GATTS_TAG, "gap register error, error code = %x", ret);
        return ESP_FAIL;
    }

    // profile B app is used to handling plugin API
    client_profile_tab[0].gattc_cb = gatts_profile_b_event_handler;
    client_profile_tab[0].gattc_if = ESP_GATT_IF_NONE;
    ret = esp_ble_gattc_app_register(0);
    if (ret){
        ESP_LOGE(GATTS_TAG, "gatts app register error, error code = %x", ret);
        return ESP_FAIL;
    }

    // enable BLE device
    if ((*cfg)["server"]["enabled"] == true) {
        ret = esp_ble_gatts_register_callback(gatts_event_handler);
        if (ret){
            ESP_LOGE(GATTS_TAG, "gatts register error, error code = %x", ret);
            return ESP_FAIL;
        }
        
        gl_profile_tab[PROFILE_A_APP_ID].gatts_cb = gatts_profile_a_event_handler;
        gl_profile_tab[PROFILE_A_APP_ID].gatts_if = ESP_GATT_IF_NONE;

        JsonArray &services = params["services"];
        gl_profile_tab[PROFILE_A_APP_ID].services = new gatts_service[1];//new gatts_service[services.size()];

        uint i = 0;
        //for (auto service : services) {
            gl_profile_tab[PROFILE_A_APP_ID].services[i].service_id.is_primary = true;
            gl_profile_tab[PROFILE_A_APP_ID].services[i].service_id.id.inst_id = 0x00;
            gl_profile_tab[PROFILE_A_APP_ID].services[i].service_id.id.uuid.len = ESP_UUID_LEN_16;
            gl_profile_tab[PROFILE_A_APP_ID].services[i].service_id.id.uuid.uuid.uuid16 = i;

            JsonArray &chars = params["server"]["values"];// service["chars"];
            if (chars.size() == 0) {
                ESP_LOGW(GATTS_TAG, "no characteristics defined on a service");
                return false;
            }
            
            gl_profile_tab[PROFILE_A_APP_ID].services[i].chars = new gatts_char[chars.size()];
            gl_profile_tab[PROFILE_A_APP_ID].services[i].chars_len = chars.size();

            uint j = 0;
            for (auto c : chars) {
                gl_profile_tab[PROFILE_A_APP_ID].services[i].chars[j] = {};
                gl_profile_tab[PROFILE_A_APP_ID].services[i].chars[j].char_uuid.len = ESP_UUID_LEN_16;
                gl_profile_tab[PROFILE_A_APP_ID].services[i].chars[j].char_uuid.uuid.uuid16 = j;

                uint8_t c_size = c["size"] | 1;

                ESP_LOGI(GATTS_TAG, "adding characteristic %d:%d with size %d", i, j, c_size);
                gl_profile_tab[PROFILE_A_APP_ID].services[i].chars[j].value = {};
                gl_profile_tab[PROFILE_A_APP_ID].services[i].chars[j].value.attr_max_len = c_size;
                gl_profile_tab[PROFILE_A_APP_ID].services[i].chars[j].value.attr_len = c_size;
                uint8_t *val_buf = (uint8_t*)malloc(c_size);
                memset(val_buf, 0, c_size);
                gl_profile_tab[PROFILE_A_APP_ID].services[i].chars[j].value.attr_value = val_buf;
                j++;
            }
            i++;
        // }

        
        ret = esp_ble_gatts_app_register(PROFILE_A_APP_ID);
        if (ret){
            ESP_LOGE(GATTS_TAG, "gatts app register error, error code = %x", ret);
            return ESP_FAIL;
        }
    }

    esp_err_t local_mtu_ret = esp_ble_gatt_set_local_mtu(500);
    if (local_mtu_ret){
        ESP_LOGE(GATTS_TAG, "set local  MTU failed, error code = %x", local_mtu_ret);
    }

    http_quick_register("/ble_scan", HTTP_GET, blescan_webhandler, this);

    return true;
}

//#endif