import { Device } from './_defs';

class InputSwitch extends Device {
    constructor() {
        super();

        this.params = {
            name: 'Configuration',
            configs: {
                gpio: { name: 'GPIO', type: 'gpio', pins: () => window.io_pins.getPins('digital_out') },
                invert: { name: 'Invert', type: 'checkbox' },
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
            'state.values[0].meta_type': 'switch',

        }
    }
}

export const inputSwitch = new InputSwitch();