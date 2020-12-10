
#ifndef ESP_PLUGIN_C009_H
#define ESP_PLUGIN_C009_H

//#ifdef CONFIG_BT_ENABLED

#include "plugin_defs.h"
#include "freertos/FreeRTOS.h"
#include "../lib/file_server.h"
#include "esp_bt.h"

#include "esp_gap_ble_api.h"
#include "esp_gatts_api.h"
#include "esp_gattc_api.h"
#include "esp_bt_defs.h"
#include "esp_bt_main.h"
#include "esp_gatt_common_api.h"

class BlueToothPlugin: public Plugin {
    
    public:
        uint8_t state;
        Type state_t = Type::byte;
        DEFINE_PLUGIN(BlueToothPlugin);

        bool bleEnabled;
        bool beaconEnabled;

        void scanDevices();
        void readDevice(esp_bd_addr_t addr, esp_bt_uuid_t service, esp_bt_uuid_t charr, char* result, uint8_t length);
        void writeDevice();
        void registerDevice();
};

#endif
//#endif
