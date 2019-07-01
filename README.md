# ESP32Ctrl

ESP32 iot controller

## install

- you will need ESP-IDF installed
- you will need nodejs and yarn installed
- `git clone https://github.com/ppisljar/esp32ctrl.git --recursive init`
- run `cd ui; yarn install; yarn build; cd ..` to build web ui
- run `make menuconfig` to configure firmware
- run `make flash monitor` to flash

## Architecture and Code

folder strucure:
- [data folder](data/) contains the content that is flashed to spiffs partition on esp32
- [ESP32 esp-idf firmware](main/README.md)
- [web front end](ui/README.md)



TODO:
- isAuthenticated crashes if config.json is too big ???? (seems like out of memory but also happens with wroover)