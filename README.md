# ESP32Ctrl

ESP32 iot controller

## install

- you will need ESP-IDF installed
 
   Toolchain version: esp32-2019r1
   Compiler version: 8.2.0

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



troubleshooting:
-- manually uploading update file:
curl --data-binary "@/path/to/esp32ctrl/build/file_server.bin" http://host/update

TODO:
- set config -> server side
-- rule engine
-- devices need to know how to set config
-- store/don't store config

- boot event (that every plugin can register): things that need to happen when all the plugins have registered.

- profiles:
-- change profile function
--- goes over all configs/states and sets them
--- goToStep function (in rule engine)
--- timed profiles
----- startProfile, setStep, stopProfile

- SD card test

- logging test (logging of state/configs)
-- start log/ stop log (for rule engine)

- ui charts (on dashboard)