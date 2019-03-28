const i2cAddr = [
    { value: 72, name: '0x48' },
    { value: 73, name: '0x49' },
    { value: 74, name: '0x4A' },
    { value: 75, name: '0x4B' },
];

const adsMode = [
    { value: 0, name: 'continious' },
    { value: 1, name: 'single' },
]

const adsRate = [
    { value: 0, name: '8' },
    { value: 1, name: '16' },
    { value: 2, name: '32' },
    { value: 3, name: '64' },
    { value: 4, name: '128' },
    { value: 5, name: '250' },
    { value: 6, name: '475' },
    { value: 7, name: '860' },
]

const adsGain = [
    { value: 0, name: '+- 6.144V' },
    { value: 1, name: '+- 4.096V' },
    { value: 2, name: '+- 2.048V' },
    { value: 3, name: '+- 1.024V' },
    { value: 4, name: '+- 0.512V' },
    { value: 5, name: '+- 0.256V' },
]


export const ads1115 = {
    defaults: () => ({
        'params.addr': 72,
        'params.mode': 1,
        'params.rate': 4,
        'params.gain': 2,
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
            addr: { name: 'Address', type: 'select', options: i2cAddr },
            mode: { name: 'Mode', type: 'select', options: adsMode },
            rate: { name: 'Rate', type: 'select', options: adsRate },
            gain: { name: 'Gain', type: 'select', options: adsGain },
        }
    },
}