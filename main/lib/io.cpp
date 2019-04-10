#include "io.h"

std::list<struct IO_DIGITAL_PINS*> IO::io_d_pins;

uint8_t ledc_channel_cnt = 0;
ledc_channel_config_t *ledc_channel[8] = {};

void IO::addDigitalPins(uint8_t number, struct IO_DIGITAL_PINS *pins) {
    pins->start = io_d_pins.empty() ? 0 : io_d_pins.back()->end + 1;
    pins->end = pins->start + number - 1;
    io_d_pins.push_back(pins);
}

struct IO_DIGITAL_PINS* IO::getDigitalPin(uint8_t pin_nr) {
    ESP_LOGD("IO", "getting digital pin %d", pin_nr);
    for (struct IO_DIGITAL_PINS *pin: io_d_pins) {
        if (pin_nr >= pin->start && pin_nr <= pin->end) {
            ESP_LOGD("IO", "found pin %d, %p, %p ,%p", pin->start, pin->digital_read, pin->digital_write, pin->set_direction);
            return pin;
        }
    }
    return NULL;
}

uint8_t IO::digitalRead(uint8_t pin) {
    auto dpin = getDigitalPin(pin);
    if (dpin == NULL || dpin->digital_read == NULL) return 0;
    else return (*(dpin->digital_read))(pin);
}

esp_err_t IO::digitalWrite(uint8_t pin, bool value) {
    auto dpin = getDigitalPin(pin);
    if (dpin == NULL || dpin->digital_write == NULL) return ESP_FAIL;
    else return (*(dpin->digital_write))(pin, value);
}

uint16_t IO::analogRead(uint8_t pin) {
    auto dpin = getDigitalPin(pin);
    if (dpin == NULL || dpin->analog_read == NULL) return 0;
    else return (*(dpin->analog_read))(pin);
}

esp_err_t IO::analogWrite(uint8_t pin, uint16_t value) {
    auto dpin = getDigitalPin(pin);
    if (dpin == NULL || dpin->analog_write == NULL) return ESP_FAIL;
    else return (*(dpin->analog_write))(pin, value);
}

esp_err_t IO::setDirection(uint8_t pin, uint8_t direction) {
    auto dpin = getDigitalPin(pin);
    if (dpin == NULL || dpin->set_direction == NULL) return ESP_FAIL;
    else return (*(dpin->set_direction))(pin, direction);
}