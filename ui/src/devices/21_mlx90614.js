import { Device } from './_defs';

const addr = [
    { name: '0x5A', value: 0x5A }
]

class Mlx90614 extends Device {
    constructor() {
        super();

        this.params = {
            name: 'Configuration',
            configs: {
                addr: { name: 'Address', type: 'select', options: addr },
                interval: { name: 'Interval', type: 'number' },
            }
        };

        this.vals = 2;
    }

    defaults = () => {
        return {
            'addr': 0x5A,
            interval: 60,

            'state.values[0].name': 'Temperature',
            'state.values[0].type': '0',
            'state.values[0].readonly': '1',
            'state.values[1].name': 'TempAmbient',
            'state.values[1].type': '0',
            'state.values[1].readonly': '1',
            // 'state.values[2].name': 'TempTherm',
            // 'state.values[2].type': '0',
        }
    }
}

export const mlx90614 = new Mlx90614();