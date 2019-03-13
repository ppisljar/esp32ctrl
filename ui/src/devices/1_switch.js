import { Device } from './_defs';

class InputSwitch extends Device {
    constructor() {
        super();

        this.params = {
            name: 'Configuration',
            configs: {
                gpio: { name: 'GPIO', type: 'gpio' },
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
            gpio: 255,
            interval: 60,
            'settings.values[0].name': 'Switch',
        }
    }
}

export const inputSwitch = new InputSwitch();