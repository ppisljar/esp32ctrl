import { Device } from './_defs';

class DigitalInput extends Device {
    constructor() {
        super();

        this.params = {
            name: 'Configuration',
            configs: {
                gpio: { name: 'GPIO', type: 'gpio' },
                invert: { name: 'Invert', type: 'checkbox' },
                interval: { name: 'Interval', type: 'number' },
            }
        };

        this.gpio = {
            name: 'GPIO Settings (global)',
            configs: {}
        };

        this.vals = 1;
    }

    defaults = () => {
        return {
            'params.gpio': 255,
            'params.invert': false,
            interval: 60,

            'state.values[0].name': 'Switch',
            'state.values[0].type': '0',
            'state.values[0].readonly': '1',
        }
    }
}

export const digital_input = new DigitalInput();