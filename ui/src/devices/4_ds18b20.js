export const ds18b20 = {
    defaults: () => ({
        gpio: 255,
        'state.values[0].name': 'Temperature',
        'state.values[0].type': '2',
        'state.values[0].meta_type': 'sensor',
    }),
    params: {
        name: 'Sensor',
        configs: {
            gpio: { name: 'GPIO', type: 'gpio' },
            interval: { name: 'Interval', type: 'number' },
        }
    },
    vals: 1,
}