
const i2c_address = [
    { value: 118, name: '0x76 (118) - (default)' }, 
    { value: 119, name: '0x77 (119)' }, 
]

export const bmx280 = {
    defaults: () => ({
        'state.values[0].name': 'Temperature',
        'state.values[0].type': '2',
        'state.values[1].name': 'Humidity',
        'state.values[1].type': '2',
        'state.values[2].name': 'Pressure',
        'state.values[2].type': '2',
    }),
    sensor: {
        name: 'Sensor',
        configs: {
            i2c_address: { name: 'I2C Address', type: 'select', options: i2c_address },
            altitude: { name: 'Altitude', type: 'number' },
            offset: { name: 'Temperature Offset', type: 'number' },
        }
    },
    vals: 3,
}