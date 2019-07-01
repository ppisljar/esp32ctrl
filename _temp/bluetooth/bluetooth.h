#ifndef __BlueTooth_H__
#define __BlueTooth_H__

#include <stdint.h>
#include <string.h>
#include <stdbool.h>
#include <stdio.h>
#include <stddef.h>

#include "esp_log.h"
#include "esp_system.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_bt.h"
#include "esp_gap_ble_api.h"
#include "esp_gattc_api.h"
#include "esp_gatt_defs.h"
#include "esp_bt_main.h"
#include "esp_gatt_common_api.h"

#ifdef __cplusplus
extern "C" {
#endif

class BlueTooth {
  public:
    BlueTooth();
    void init();                   // inits bluetooth
    void deinit();                 // deinits bluetooth
    void bt_light_on();
    void bt_light_off();
    void bt_light_level(uint8_t level);
    void getDevices(void(* func)(uint16_t packet_id, void* devices, uint16_t data_len), uint16_t packet_id);             // scans for bluetooth devices
    void getServices(uint8_t mac[6], void(* func)(uint16_t packet_id, void* devices, uint16_t data_len), uint16_t packet_id);            // gets service list from specific devices
    void getCharracteristics(uint8_t mac[6], uint16_t service, void(* func)(uint16_t packet_id, void* devices, uint16_t data_len), uint16_t packet_id);    // gets charracteristics for specific device/SERVICES
    void readValue();              // reads value from specific device/service/charracteristics
    void setValue(uint8_t mac[6], uint16_t service, uint16_t charracteristic, uint8_t* data, uint8_t data_len);             // writes value to ..
    void removeDevice(uint8_t mac[6]);
    bool addDevice(uint8_t mac[6], uint16_t service, uint16_t charracteristic, char* format);
};

#ifdef __cplusplus
}
#endif

#endif
