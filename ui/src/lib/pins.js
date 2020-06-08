import { settings } from "./settings";
import { devices } from "../devices";

function copy(o) {
    var output, v, key;
    output = Array.isArray(o) ? [] : {};
    for (key in o) {
        v = o[key];
        output[key] = (typeof v === "object") ? copy(v) : v;
    }
    return output;
}

const pinState = [
    { name: 'Default', value: 0 },
    { name: 'Low', value: 1 },
    { name: 'High', value: 2 },
    { name: 'Input', value: 3 },
];

class IO_PINS {
    constructor() {
        this.digitalPins = [{ name: '-- select --', value: 255, capabilities: ['digital_in', 'analog_in', 'digital_out', 'analog_out'], configs: {}}];
        for (let i = 0; i < 40; i++) {
            if ([6,7,8,9,10,11].includes(i)) continue; // SPI flash pins
            if ([16,17].includes(i)) continue; // setting theese to output causes reset
            // add check for serial pins
            const pin = {
                name: `ESP32 GPIO${i}`,
                value: i,
                capabilities: ['core', 'digital_in'],
                configs: {},
            };
            if (pin.value < 32) {
                pin.configs.pull_up = { name: `Pin ${pin.value} pull up`, type: 'checkbox' };
                pin.configs.boot_state = { name: `Pin ${pin.value} boot state`, type: 'select', options: pinState, var: `ROOT.hardware.gpio.${pin.value}` };
                pin.capabilities.push('digital_out');
                pin.capabilities.push('analog_out');
            } else {
                pin.capabilities.push('analog_in');
            }
            this.digitalPins.push(pin);
        }
        
    }

    setUsedPins(allPins) {
        const resetPin = settings.get('hardware.reset.pin');
        if (resetPin) allPins.find(ap => ap.value == resetPin).disabled = "RESET";

        const ledPin = settings.get('hardware.led.gpio');
        if (ledPin) allPins.find(ap => ap.value == ledPin).disabled = "LED";

        const i2c = settings.get('hardware.i2c');
        if (i2c && i2c["enabled"]) {
            if (i2c["scl"]) allPins.find(ap => ap.value == i2c["scl"]).disabled = "I2C";
            if (i2c["sda"]) allPins.find(ap => ap.value == i2c["sda"]).disabled = "I2C";
        }

        const sdcard = settings.get('hardware.spi');
        if (sdcard && sdcard['enabled']) {
            [2, 4, 12, 13, 14, 15].forEach(x => {
                allPins.find(ap => ap.value == x).disabled = "SPI";
            });
        }
        const plugins = settings.get('plugins');
        plugins.filter(p => p).forEach(cur => {
            const plugin = devices.find(d => d.value === cur.type).fields;
            if (plugin.getDeviceUsedPins) {
                const pins = plugin.getDeviceUsedPins(cur);
                pins.forEach(p => {
                    allPins.find(ap => ap.value == p).disabled = cur.name;
                });
            }
        }, []);
    }

    getInterruptPins() {
        const hwpins = settings.get('hardware.gpio') || [];
        return this.digitalPins.filter((p) => hwpins[p.value] && hwpins[p.value].interrupt && hwpins[p.value].mode == 3);
    }

    getPins(capabilities) {
        if (capabilities === 'interrupt') return this.getInterruptPins();
        const plugins = settings.get('plugins');
        const startPins = copy(this.digitalPins);
        let lastNr = startPins[startPins.length-1].value;
        const pins = plugins.reduce((acc, cur, i) => {
            if (!cur) return acc;
            const plugin = devices.find(d => d.value === cur.type).fields;
            if (plugin.getDevicePins) {
                const pins = plugin.getDevicePins(cur, i);
                pins.forEach(p => {
                    p.value = ++lastNr;
                    acc.push(p);
                });
            }
            return acc;
        }, [...startPins]);
        this.setUsedPins(pins);
        const cs = Array.isArray(capabilities) ? capabilities : [capabilities];
        return cs.length ? pins.filter(pin => cs.every(c => pin.capabilities.includes(c))) : pins; 
    }

}

export const ioPins = window.io_pins = new IO_PINS();

export const pins = window.pins = () => {
    return ioPins.getPins(['digital_in', 'digital_out']);
};