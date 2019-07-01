import { Device } from './_defs';

class PWMOutput extends Device {
    constructor() {
        super();

        this.params = {
            name: 'Configuration',
            configs: {
                gpio: { name: 'GPIO', type: 'gpio', pins: () => window.io_pins.getPins('analog_out') },
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

            'state.values[0].name': 'Output',
            'state.values[0].type': '1',
        }
    }
}

export const pwmOutput = new PWMOutput();