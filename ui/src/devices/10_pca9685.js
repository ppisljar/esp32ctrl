import {Device} from './_defs';

const i2cAddr = 
    [...new Array(64)].map((x, i) => {
        return { name: `0x${(i+64).toString(16)}`, value: i+64 };
    })
;

class PCA9685 extends Device {
    constructor() {
        super();

        this.params = {
            name: 'Sensor',
                configs: {
                addr: { name: 'Address', type: 'select', options: i2cAddr },
                freq: { name: 'Frequency', type: 'number', min: 24, max: 1526 },
            }
        };
    }

    defaults = () => ({
        'params.addr': 56,
        'params.freq': 500,
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