const i2cAddr = [
    { value: 72, name: '0x48' },
    { value: 73, name: '0x49' },
    { value: 74, name: '0x4A' },
    { value: 75, name: '0x4B' },
];


export const ads1115 = {
    defaults: () => ({
        'params.addr': 72,
    }),
    getDevicePins: (conf) => {
        return [...new Array(4)].map((x,i) => ({
            name: `${conf.name} GPIO${i}`,
            value: i,
            capabilities: ['analog_in'],
        }));
    },
    params: {
        name: 'Sensor',
        configs: {
            addr: { name: 'Address', type: 'select', options: i2cAddr }
        }
    },
    vars: 0
}