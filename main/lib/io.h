#ifndef ESP_LIB_IO_H
#define ESP_LIB_IO_H

#include "esp_log.h"
#include "esp_system.h"
#include <driver/adc.h>
#include <list>

class IO_set_direction {
  public:
    IO_set_direction() {};
    virtual uint8_t operator()(uint8_t pin, uint8_t mode) = 0;
};

class IO_digital_read {
  public:
    IO_digital_read() {};
    virtual uint8_t operator()(uint8_t pin) = 0;
};

class IO_digital_write {
  public:
    IO_digital_write() {};
    virtual uint8_t operator()(uint8_t pin, uint8_t value) = 0;
};

class IO_analog_read {
  public:
    IO_analog_read() {};
    virtual uint16_t operator()(uint8_t pin) = 0;
};

class IO_analog_write {
  public:
    IO_analog_write() {};
    virtual uint8_t operator()(uint8_t pin, uint16_t value) = 0;
};


struct IO_DIGITAL_PINS {
  uint8_t start;
  uint8_t end;
  IO_digital_write* digital_write = 0;
  IO_digital_read* digital_read = 0;
  IO_set_direction* set_direction = 0;
  IO_analog_write* analog_write = 0;
  IO_analog_read* analog_read = 0;
};

class IO
{
    private:
        static std::list<struct IO_DIGITAL_PINS*> io_d_pins;
    public:
        IO() {}

        static void addDigitalPins(uint8_t number, struct IO_DIGITAL_PINS *pins);
        static struct IO_DIGITAL_PINS* getDigitalPin(uint8_t pin_nr);

        uint8_t digitalRead(uint8_t pin);
        esp_err_t digitalWrite(uint8_t pin, bool value);
        uint16_t analogRead(uint8_t pin);
        esp_err_t analogWrite(uint8_t pin, uint16_t value);
        esp_err_t setDirection(uint8_t pin, uint8_t direction);
};




class ESP_set_direction : public IO_set_direction {
    public:
        ESP_set_direction() { };
        uint8_t operator()(uint8_t pin, uint8_t mode) {
            if (pin > 31) return ESP_FAIL;
            return gpio_set_direction((gpio_num_t)pin, (gpio_mode_t)mode);
        }
};

class ESP_digital_read : public IO_digital_read {
    public:
        ESP_digital_read() { };
        uint8_t operator()(uint8_t pin) {
            if (pin > 31) return 0;
            ESP_LOGI("IO", "ESP get level %d", pin);
            return gpio_get_level((gpio_num_t)pin);
        }
};

class ESP_digital_write : public IO_digital_write {
    public:
        ESP_digital_write() {};
        uint8_t operator()(uint8_t pin, uint8_t value) {
            if (pin > 31) return ESP_FAIL;
            ESP_LOGI("IO", "ESP set level %d = %d", pin, value);
            return gpio_set_level((gpio_num_t)pin, value);
        }
};

class ESP_analog_read : public IO_analog_read {
    public:
        ESP_analog_read() { };
        uint16_t operator()(uint8_t pin) {
            if (pin < 32) return 0;
            return adc1_get_raw((adc1_channel_t)(pin-32));
        }
};

class ESP_analog_write : public IO_analog_write {
    public:
        ESP_analog_write() {};
        uint8_t operator()(uint8_t pin, uint16_t value) {
            return 0;
        }
};

/*
#define IO___LOCALS(VARIABLE, I) VARIABLE;
#define IO___PARAMS(VARIABLE, I) VARIABLE ## _,
#define IO___PARAMS_TO_LOCALS(VARIABLE, I) VARIABLE ## _ = VARIABLE;


// i would need substring macro, which would convert int a to a
// or pass argument types and names in separately ?
#define IO_ANALOG_READ_FUNC(className, ...) class className ## _analog_read { \
    private: \
      FOREACH_MACRO(IO___LOCALS, __VA_ARGS__) \
      className *obj; \
    public: \
        className ## _analog_read(FOREACH_MACRO(IO___PARAMS, __VA_ARGS__) , className *obj_) { \
            FOREACH_MACRO(IO___PARAMS_TO_LOCALS, __VA_ARGS__) \
            obj = obj_; \
        } \
        uint16_t operator()(uint8_t pin) {    

#define IO_DIGITAL_READ_FUNC(className, ...) class className ## _digital_read { \
    private: \
      FOREACH_MACRO(IO___LOCALS, __VA_ARGS__) \
    public: \
        className ## _digital_read(FOREACH_MACRO(IO___PARAMS, __VA_ARGS__)) { \
            FOREACH_MACRO(IO___PARAMS_TO_LOCALS, __VA_ARGS__) \
        } \
        uint8_t operator()(uint8_t pin) {  

#define IO_DIGITAL_WRITE_FUNC(className, ...) class className ## _digital_write { \
    private: \
      FOREACH_MACRO(IO___LOCALS, __VA_ARGS__) \
    public: \
        className ## _digital_write(FOREACH_MACRO(IO___PARAMS, __VA_ARGS__)) { \
            FOREACH_MACRO(IO___PARAMS_TO_LOCALS, __VA_ARGS__) \
        } \
        uint8_t operator()(uint8_t pin, uint8_t value) {  

#define IO_DIGITAL_SET_DIRECTION(className, ...) class className ## _set_direction { \
    private: \
      FOREACH_MACRO(IO___LOCALS, __VA_ARGS__) \
    public: \
        className ## _set_direction(FOREACH_MACRO(IO___PARAMS, __VA_ARGS__)) { \
            FOREACH_MACRO(IO___PARAMS_TO_LOCALS, __VA_ARGS__) \
        } \
        uint8_t operator()(uint8_t pin, uint8_t value) {  


#define IO_FUNC_END()        } \
};
*/

#endif