#include "io.h"

std::list<struct IO_DIGITAL_PINS*> IO::io_d_pins;
std::list<struct IO_ANALOG_PINS*> IO::io_a_pins;

void IO::addDigitalPins(uint8_t number, struct IO_DIGITAL_PINS *pins) {
    pins->start = io_d_pins.empty() ? 0 : io_d_pins.back()->end + 1;
    pins->end = pins->start + number;
    io_d_pins.push_back(pins);
}

void IO::addAnalogPins(uint8_t number, struct IO_ANALOG_PINS *pins) {
    pins->start = io_a_pins.empty() ? 0 : io_a_pins.back()->end + 1;
    pins->end = pins->start + number;
    io_a_pins.push_back(pins);
}

void IO::addPWMPins(uint8_t number, struct IO_PWM_PINS *pins) {
    pins->start = io_p_pins.empty() ? 0 : io_p_pins.back()->end + 1;
    pins->end = pins->start + number;
    io_p_pins.push_back(pins);
}

struct IO_DIGITAL_PINS* IO::getDigitalPin(uint8_t pin_nr) {
    for (struct IO_DIGITAL_PINS *pin: io_d_pins) {
        if (pin_nr >= pin->start && pin_nr <= pin->end) {
            return pin;
        }
    }
    return NULL;
}

struct IO_ANALOG_PINS* IO::getAnalogPin(uint8_t pin_nr) {
    for (struct IO_ANALOG_PINS *pin: io_a_pins) {
        if (pin_nr >= pin->start && pin_nr <= pin->end) {
            return pin;
        }
    }
    return NULL;
}

struct IO_PWM_PINS* IO::getPWMPin(uint8_t pin_nr) {
    for (struct IO_PWM_PINS *pin: io_p_pins) {
        if (pin_nr >= pin->start && pin_nr <= pin->end) {
            return pin;
        }
    }
    return NULL;
}

uint8_t IO::digitalRead(uint8_t pin) {
    io_digital_read_fn_t &fn1 = *getDigitalPin(pin)->digital_read;
    return fn1(pin);
}

esp_err_t IO::digitalWrite(uint8_t pin, bool value) {
    return getDigitalPin(pin)->digital_write(pin, value);
}

uint16_t IO::analogRead(uint8_t pin) {
    return getAnalogPin(pin)->analog_read(pin);
}

esp_err_t IO::analogWrite(uint8_t pin, uint16_t value) {
    return getAnalogPin(pin)->analog_write(pin, value);
}

esp_err_t IO::setDirection(uint8_t pin, uint8_t direction) {
    return getDigitalPin(pin)->set_direction(pin, direction);
}

// io_analog_read_t analogRead = &io_pins.getPin(pin_nr).analog_read;
// uint16_t val = analogRead(pin_nr);