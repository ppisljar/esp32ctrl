## config

## controller

## file server

File server starts http server, register all default paths and allows plugins to register additional paths.



## global state

```
struct global_state_t {
    bool wifi_connected = 0;
    bool sdcard_connected = 0;
};

extern struct global_state_t global_state;
```

## io

io service which allows extending the number of IO pins thru different extenders. Plugins can reigster additional pins to the service and other plugins can then use those pins just as they would use pins provided by esp.

to register pins plugin can use
- IO::addDigitalPins(uint8_t number, struct IO_DIGITAL_PINS *pins)

where IO_DIGITAL_PINS structure looks like
```
struct IO_DIGITAL_PINS {
  uint8_t start;
  uint8_t end;
  IO_digital_write* digital_write = 0;
  IO_digital_read* digital_read = 0;
  IO_set_direction* set_direction = 0;
  IO_analog_write* analog_write = 0;
  IO_analog_read* analog_read = 0;
};
```

to use io service plugins can use the following functions:
- `uint8_t digitalRead(uint8_t pin);`
- `esp_err_t digitalWrite(uint8_t pin, bool value);`
- `uint16_t analogRead(uint8_t pin);`
- `esp_err_t analogWrite(uint8_t pin, uint16_t value);`
- `esp_err_t setDirection(uint8_t pin, uint8_t direction);`

## logging

allows logging over the web thru normal esp-idf logging functions:
- `ESP_LOGI(char* tag, char* template_string, ...)`
- `ESP_LOGW(char* tag, char* template_string, ...)`
- `ESP_LOGE(char* tag, char* template_string, ...)`
- `ESP_LOGD(char* tag, char* template_string, ...)`


## spiffs
- `spiffs_init()`
- `sdcard_init(JsonObject& spiConfig)`
- `sdcard_unmount()`
- `char* read_file(char * filename, long *len)` reads file, if filename starts with `/spiffs/` from spiffs and if file starts from `/sdcard/` from sdcard
- `esp_err_t write_file(char *filepath, char * data, uint16_t length)`