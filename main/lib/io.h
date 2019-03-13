#ifndef ESP_LIB_IO_H
#define ESP_LIB_IO_H

#include "esp_log.h"
#include "esp_system.h"
#include <list>

typedef uint8_t(io_digital_read_fn_t)(uint8_t);
typedef esp_err_t(io_digital_write_fn_t)(uint8_t, bool);
typedef uint16_t(io_analog_read_fn_t)(uint8_t);
typedef esp_err_t(io_analog_write_fn_t)(uint8_t, uint16_t);
typedef esp_err_t(io_set_direction_fn_t)(uint8_t, uint8_t);

struct IO_DIGITAL_PINS {
  uint8_t start;
  uint8_t end;
  io_digital_write_fn_t* digital_write = 0;
  io_digital_read_fn_t* digital_read = 0;
  io_set_direction_fn_t* set_direction = 0;
};

struct IO_ANALOG_PINS {
  uint8_t start;
  uint8_t end;
  io_analog_write_fn_t* analog_write = 0;
  io_analog_read_fn_t* analog_read = 0;
};

struct IO_PWM_PINS {
  uint8_t start;
  uint8_t end;
  io_analog_write_fn_t* analog_write = 0;
  io_analog_read_fn_t* analog_read = 0;
};

class IO
{
    private:
        static std::list<struct IO_DIGITAL_PINS*> io_d_pins;
        static std::list<struct IO_ANALOG_PINS*> io_a_pins;
        static std::list<struct IO_PWM_PINS*> io_p_pins;
    public:
        IO() {}

        static void addDigitalPins(uint8_t number, struct IO_DIGITAL_PINS *pins);
        static void addAnalogPins(uint8_t number, struct IO_ANALOG_PINS *pins);
        static void addPWMPins(uint8_t number, struct IO_PWM_PINS *pins);
        static struct IO_DIGITAL_PINS* getDigitalPin(uint8_t pin_nr);
        static struct IO_ANALOG_PINS* getAnalogPin(uint8_t pin_nr);
        static struct IO_PWM_PINS* getPWMPin(uint8_t pin_nr);

        uint8_t digitalRead(uint8_t pin);
        esp_err_t digitalWrite(uint8_t pin, bool value);
        uint16_t analogRead(uint8_t pin);
        esp_err_t analogWrite(uint8_t pin, uint16_t value);
        esp_err_t setDirection(uint8_t pin, uint8_t direction);
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