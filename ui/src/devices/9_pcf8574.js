import {Device} from './_defs';

const i2cAddr = [
    { value: 32, name: '0x20' },
    { value: 33, name: '0x21' },
    { value: 34, name: '0x22' },
    { value: 35, name: '0x23' },
];

class PCF8574 extends Device {
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

    getDeviceDigitalPins = (conf) => {
       return [...new Array(8)].map((x,i) => ({
           name: `${conf.name} GPIO${i}`,
           value: i,
           capabilities: ['digital_in', 'digital_out'],
       }));
    };
}

export const pcf8574 = new PCF8574();