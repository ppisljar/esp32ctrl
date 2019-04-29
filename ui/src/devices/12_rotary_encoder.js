import { Device } from './_defs';

class RotaryEncoder extends Device {
    constructor() {
        super();

        this.params = {
            name: 'Configuration',
            configs: {
                gpio1: { name: 'GPIO1', type: 'gpio' },
                gpio2: { name: 'GPIO2', type: 'gpio' },
                invert: { name: 'Invert', type: 'checkbox' },
                interval: { name: 'Interval', type: 'number' },
            }
        };

        this.gpio1 = {
            name: 'GPIO1 Settings (global)',
            configs: {}
        };

        this.gpio2 = {
            name: 'GPIO2 Settings (global)',
            configs: {}
        };

        this.vals = 1;
    }

    defaults = () => {
        return {
            'params.gpio1': 255,
            'params.gpio2': 255,
            'params.invert': false,
            interval: 60,
            'state.values[0].name': 'State',
            'state.values[0].type': '2',
        }
    }
}

export const rotaryEncoder = new RotaryEncoder();