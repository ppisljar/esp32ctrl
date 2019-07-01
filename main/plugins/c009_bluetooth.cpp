#ifdef CONFIG_ENABLE_C009
#include "c009_bluetooth.h"
#include "../lib/rule_engine.h"
#include "../lib/config.h"

#include "esp_bt.h"

#include "esp_gap_ble_api.h"
#include "esp_gatts_api.h"
#include "esp_bt_defs.h"
#include "esp_bt_main.h"
#include "esp_gatt_common_api.h"

static const char *TAG = "BlueToothPlugin";

extern Plugin* active_plugins[10];
extern Config* g_cfg;

PLUGIN_CONFIG(BlueToothPlugin, t1_enabled, t2_enabled, t3_enabled, t4_enabled)
PLUGIN_STATS(BlueToothPlugin, state, state)

#define GATTS_TAG "GATTS_DEMO"

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
#define PROFILE_B_APP_ID 1

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


/* One gatt-based profile one app_id and one gatts_if, this array will store the gatts_if returned by ESP_GATTS_REG_EVT */
static struct gatts_profile_inst gl_profile_tab[PROFILE_NUM] = {};

typedef struct {
    uint8_t                 *prepare_buf;
    int                     prepare_len;
} prepare_type_env_t;

static prepare_type_env_t a_prepare_write_env;
static prepare_type_env_t b_prepare_write_env;

void example_write_event_env(esp_gatt_if_t gatts_if, prepare_type_env_t *prepare_write_env, esp_ble_gatts_cb_param_t *param);
void example_exec_write_event_env(prepare_type_env_t *prepare_write_env, esp_ble_gatts_cb_param_t *param);

static void gap_event_handler(esp_gap_ble_cb_event_t event, esp_ble_gap_cb_param_t *param)
{
    switch (event) {
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
    case ESP_GAP_BLE_ADV_STOP_COMPLETE_EVT:
        if (param->adv_stop_cmpl.status != ESP_BT_STATUS_SUCCESS) {
            ESP_LOGE(GATTS_TAG, "Advertising stop failed\n");
        } else {
            ESP_LOGI(GATTS_TAG, "Stop adv successfully\n");
        }
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

bool BlueToothPlugin::init(JsonObject &params) {
    cfg = &((JsonObject &)params);
    state_cfg = &((JsonArray &)params["state"]);

    adv_params.adv_int_min = 0x20;
    adv_params.adv_int_max = 0x40;
    adv_params.adv_type = ADV_TYPE_IND;
    adv_params.own_addr_type = BLE_ADDR_TYPE_PUBLIC;
    adv_params.channel_map = ADV_CHNL_ALL;
    adv_params.adv_filter_policy = ADV_FILTER_ALLOW_SCAN_ANY_CON_ANY;

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
    }

    ESP_ERROR_CHECK(esp_bt_controller_mem_release(ESP_BT_MODE_CLASSIC_BT));

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

    gl_profile_tab[0].gatts_cb = gatts_profile_a_event_handler;
    gl_profile_tab[0].gatts_if = ESP_GATT_IF_NONE;

    JsonArray &services = params["services"];
    gl_profile_tab[0].services = new gatts_service[1];//new gatts_service[services.size()];

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
        
        gl_profile_tab[0].services[i].chars = new gatts_char[chars.size()];
        gl_profile_tab[0].services[i].chars_len = chars.size();

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
    //     i++;
    // }

    ret = esp_ble_gatts_register_callback(gatts_event_handler);
    if (ret){
        ESP_LOGE(GATTS_TAG, "gatts register error, error code = %x", ret);
        return ESP_FAIL;
    }
    ret = esp_ble_gap_register_callback(gap_event_handler);
    if (ret){
        ESP_LOGE(GATTS_TAG, "gap register error, error code = %x", ret);
        return ESP_FAIL;
    }
    ret = esp_ble_gatts_app_register(PROFILE_A_APP_ID);
    if (ret){
        ESP_LOGE(GATTS_TAG, "gatts app register error, error code = %x", ret);
        return ESP_FAIL;
    }
    // ret = esp_ble_gatts_app_register(PROFILE_B_APP_ID);
    // if (ret){
    //     ESP_LOGE(GATTS_TAG, "gatts app register error, error code = %x", ret);
    //     return;
    // }
    esp_err_t local_mtu_ret = esp_ble_gatt_set_local_mtu(500);
    if (local_mtu_ret){
        ESP_LOGE(GATTS_TAG, "set local  MTU failed, error code = %x", local_mtu_ret);
    }

    return true;
}

#endif