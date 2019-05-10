#ifndef ESP_PLUGIN_016_H
#define ESP_PLUGIN_016_H

#include "plugin_defs.h"
#include "lwip/err.h"
#include "lwip/sockets.h"
#include "lwip/sys.h"
#include <lwip/netdb.h>

class UdpServerPlugin: public Plugin {
    private:
        int interval = 60;
        int port = 5000;
        uint8_t packet_len = 0;
        uint8_t state;
        Type state_t = Type::byte;
        TaskHandle_t task_h;
    public:
        DEFINE_PPLUGIN(UdpServerPlugin, 16);

        static void task(void *pvParameters);
};

#endif