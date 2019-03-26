import { Device } from './_defs';

class InputSwitch extends Device {
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
        }
    }
}

export const inputSwitch = new InputSwitch();