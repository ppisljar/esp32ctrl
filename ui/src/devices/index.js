import { inputSwitch } from './1_switch';
import { dht } from './2_dht';
import { bmx280 } from './3_bmx280';
import { ds18b20 } from './4_ds18b20';
import { levelControl } from './5_level_control';
import { pcf8574 } from "./9_pcf8574";
import { mcp23017 } from "./8_mcp23017";
import { ads1115 } from "./7_ads1115";
import { analog } from "./6_analog";
import { pca9685 } from './10_pca9685';
import { mqtt } from './11_mqtt';
import { rotaryEncoder } from './12_rotary_encoder';
import { http } from './13_http';
import { dummy } from './14_dummy';
import { dimmer } from './15_dimmer';

// import { bmp085 } from './6_bmp085';
// import { pcf8591 } from './7_pcf8591';
// import { rfidWeigand } from './8_rfid';
// import { inputMcp } from './9_io_mcp';
// import { bh1750 } from './10_light_lux';
// import { pme } from './11_pme';
// import { lcd2004 } from './12_lcd';
// import { hcsr04 } from './13_hcsr04';
// import { si7021 } from './14_si7021';
// import { tls2561 } from './15_tls2561';
// import { pn532 } from './17_pn532';
// import { dust } from './18_dust';
// import { pcf8574 } from './19_pcf8574';
// import { ser2net } from './20_ser2net';
// import { levelControl } from './21_level_control';
// import { pca9685 } from './22_pca9685';
// import { oled1306 } from './23_oled1306';
// import { mlx90614 } from './24_mlx90614';
// import { ads1115 } from './25_ads1115';
// import { systemInfo } from './26_system_info';
// import { ina219 } from './27_ina219';
// import { bmx280 } from './28_bmx280';
// import { mqttDomoticz } from './29_mqtt_domoticz';
// import { bmp280 } from './30_bmp280';
// import { sht1x } from './31_sht1x';
// import { ms5611 } from './32_ms5611';
// import { dummyDevice } from './33_dummy_device';
// import { dht12 } from './34_dht12';
// import { sh1106 } from './36_sh1106';
// import { mqttImport } from './37_mqtt_import';
// import { neopixelBasic } from './38_neopixel_basic';
// import { thermocouple } from './39_thermocouple';
// import { neopixelClock } from './41_neopixel_clock';
// import { neopixelCandle } from './42_neopixel_candle';
// import { clock } from './43_output_clock';
// import { wifiGateway } from './44_wifi_gateway';
// import { mhz19 } from './49_mhz19';
// import { senseAir } from './52_senseair';
// import { sds011 } from './56_sds011';
// import { rotaryEncoder } from './59_rotary_encoder';
// import { ttp229 } from './63_ttp229';

export const devices = [
    { name: '- None -', value: 0, fields: [] },
    { name: 'Generic - Switch', value: 1, fields: inputSwitch },
    { name: 'Environment - DHT11/12/22  SONOFF2301/7021', value: 2, fields: dht },
    { name: 'Environment - BME280/BMP280', value: 3, fields: bmx280 },
    { name: 'Environment - DS18b20', value: 4, fields: ds18b20 },
    { name: 'Generic - Level Control', value: 5, fields: levelControl },
    { name: 'Generic - Analog Input', value: 6, fields: analog },
    { name: 'IO - ADS1115', value: 7, fields: ads1115 },
    { name: 'IO - MCP23017', value: 8, fields: mcp23017 },
    { name: 'IO - PCF8574', value: 9, fields: pcf8574 },
    { name: 'IO - PCA9685', value: 10, fields: pca9685 },
    { name: 'Generic - MQTT', value: 11, fields: mqtt },
    { name: 'Generic - Rotary Encoder', value: 12, fields: rotaryEncoder },
    { name: 'Generic - HTTP', value: 13, fields: http },
    { name: 'Generic - Dummy Device', value: 14, fields: dummy },
    { name: 'Generic - Dimmer', value: 15, fields: dimmer },
    //{ name: 'Light/Lux - BH1750', value: 10, fields: bh1750 },
    // { name: 'Extra IO - ProMini Extender', value: 11, fields: pme },
    // { name: 'Display - LCD2004', value: 12, fields: lcd2004 },
    // { name: 'Position - HC-SR04, RCW-0001, etc.', value: 13, fields: hcsr04 },
    // { name: 'Environment - SI7021/HTU21D', value: 14, fields: si7021 },
    // { name: 'Light/Lux - TSL2561', value: 15, fields: tls2561 },
    // //{ name: 'Communication - IR', value: 16, fields: bh1750 },
    // { name: 'RFID - PN532', value: 17, fields: pn532 },
    // { name: 'Dust - Sharp GP2Y10', value: 18, fields: dust },
    // { name: 'Switch input - PCF8574', value: 19, fields: pcf8574 },
    // { name: 'Communication - Serial Server', value: 20, fields: ser2net },
    // { name: 'Regulator - Level Control', value: 21, fields: levelControl },
    // { name: 'Extra IO - PCA9685', value: 22, fields: pca9685 },
    // { name: 'Display - OLED SSD1306', value: 23, fields: oled1306 },
    // { name: 'Environment - MLX90614', value: 24, fields: mlx90614 },
    // { name: 'Analog input - ADS1115', value: 25, fields: ads1115 },
    // { name: 'Generic - System Info', value: 26, fields: systemInfo },
    // { name: 'Energy (DC) - INA219', value: 27, fields: ina219 },
    // { name: 'Environment - BMx280', value: 28, fields: bmx280 },
    // { name: 'Output - Domoticz MQTT Helper', value: 29, fields: mqttDomoticz },
    // { name: 'Environment - BMP280', value: 30, fields: bmp280 },
    // { name: 'Environment - SHT1X', value: 31, fields: sht1x },
    // { name: 'Environment - MS5611 (GY-63)', value: 32, fields: ms5611 },
    // { name: 'Generic - Dummy Device', value: 33, fields: dummyDevice },
    // { name: 'Environment - DHT12 (I2C)', value: 34, fields: dht12 },
    // { name: 'Display - OLED SSD1306/SH1106 Framed', value: 36, fields: sh1106 },
    // { name: 'Generic - MQTT Import', value: 37, fields: mqttImport },
    // { name: 'Output - NeoPixel (Basic)', value: 38, fields: neopixelBasic },
    // { name: 'Environment - Thermocouple', value: 39, fields: thermocouple },
    // { name: 'Output - NeoPixel (Word Clock)', value: 41, fields: neopixelClock },
    // { name: 'Output - NeoPixel (Candle)', value: 42, fields: neopixelCandle },
    // { name: 'Output - Clock', value: 43, fields: clock },
    // { name: 'Communication - P1 Wifi Gateway', value: 44, fields: wifiGateway },
    // { name: 'Gases - CO2 MH-Z19', value: 49, fields: mhz19 },
    // { name: 'Gases - CO2 Senseair', value: 52, fields: senseAir },
    // { name: 'Dust - SDS011/018/198', value: 56, fields: sds011 },
    // { name: 'Switch Input - Rotary Encoder', value: 59, fields: rotaryEncoder },
    // { name: 'Keypad - TTP229 Touc', value: 63, fields: ttp229 },
].sort((a, b) => a.name.localeCompare(b.name));