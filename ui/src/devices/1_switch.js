import { Device } from './_defs';

class InputSwitch extends Device {
    constructor() {
        super();

        this.params = {
            name: 'Configuration',
            configs: {
                gpio: { name: 'GPIO', type: 'select', options: () => { return window.pins() } },
                interval: { name: 'Interval', type: 'number' },
            }
        };

        this.gpio = {
            name: 'GPIO Settings (global)',
            configs: {
                pullup: { name: 'Internal PullUp', type: 'checkbox' },
                inversed: { name: 'Inversed logic', type: 'checkbox' },
                send_boot_state: { name: 'Send Boot State', type: 'checkbox' },
            }
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