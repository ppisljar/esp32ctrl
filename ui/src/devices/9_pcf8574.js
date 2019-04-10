import {Device} from './_defs';

const i2cAddr = [
    { value: 32, name: '0x20' },
    { value: 33, name: '0x21' },
    { value: 34, name: '0x22' },
    { value: 35, name: '0x23' },
];

const typeOptions = [
    { value: 0, name: 'pcf8574' },
    { value: 1, name: 'pcf8575' },
]

const pinBootStates = [
    { value: 0, name: 'LOW' },
    { value: 1, name: 'HIGH' },
]
class PCF8574 extends Device {
    constructor() {
        super();

        this.params = {
            name: 'Sensor',
            configs: {
                addr: { name: 'Address', type: 'select', options: i2cAddr },
                type: { name: 'Type', type: 'select', options: typeOptions }
            }
        };

        this.pins = {
            name: 'Pin Configuration',
            configs: {

            }
        }

        for (let i = 0; i < 16; i++) {
            if (i < 8) this.pins.configs[i] = { name: `Pin ${i} boot state`, type: 'select', options: pinBootStates };
            else this.pins.configs[i] = { name: `Pin ${i} boot state`, type: 'select', if: 'params.type', ifval: 1, options: pinBootStates };
        }
    }

    defaults = () => ({
        'params.addr': 56,
    });

    getDevicePins = (conf, plugin) => {
        const n = conf.params.type ? 16 : 8;
       return [...new Array(n)].map((x,i) => ({
           name: `${conf.name} GPIO${i}`,
           value: i,
           capabilities: ['digital_in', 'digital_out'],
           configs: {
               boot_state: { name: `Pin ${i} boot state`, type: 'select', options: pinBootStates, var: `ROOT.plugins[${plugin}].pins.${i}` }
           }
       }));
    };
}

export const pcf8574 = new PCF8574();