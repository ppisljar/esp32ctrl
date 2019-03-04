
const i2c_address = [
    { value: 118, name: '0x76 (118) - (default)' }, 
    { value: 119, name: '0x77 (119)' }, 
]

export const bmx280 = {
    defaults: () => ({
        'settings.values[0].name': 'Temperature',
        'settings.values[1].name': 'Humidity',
        'settings.values[2].name': 'Pressure',
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