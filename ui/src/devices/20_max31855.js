import { Device } from './_defs';

class Max31855 extends Device {
    constructor() {
        super();

        this.params = {
            name: 'Configuration',
            configs: {
                cs: { name: 'CS', type: 'gpio' },
                clk: { name: 'CLK', type: 'gpio' },
                data: { name: 'DATA', type: 'gpio' },
                interval: { name: 'Interval', type: 'number' },
            }
        };

        this.vals = 1;
    }

    defaults = () => {
        return {
            'params.cs': 255,
            'params.clk': 255,
            'params.data': 255,
            interval: 60,

            'state.values[0].name': 'Temperature',
            'state.values[0].type': '2',
            'state.values[0].readonly': '1',
            // 'state.values[1].name': 'TempRJ',
            // 'state.values[1].type': '0',
            // 'state.values[2].name': 'TempTherm',
            // 'state.values[2].type': '0',
        }
    }
}

export const max31855 = new Max31855();