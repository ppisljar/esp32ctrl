import {Device} from './_defs';

const i2cAddr = [
    { value: 56, name: '0x38' },
    { value: 57, name: '0x39' },
    { value: 58, name: '0x3A' },
    { value: 59, name: '0x3B' },
];

class PCA9685 extends Device {
    constructor() {
        super();

        this.params = {
            name: 'Sensor',
                configs: {
                addr: { name: 'Address', type: 'select', options: i2cAddr }
            }
        };
    }

    defaults = () => ({
        'params.addr': 56,
    });

    getDevicePins = (conf) => {
       return [...new Array(16)].map((x,i) => ({
           name: `${conf.name} GPIO${i}`,
           value: i,
           capabilities: ['analog_out'],
       }));
    };
}

export const pca9685 = new PCA9685();