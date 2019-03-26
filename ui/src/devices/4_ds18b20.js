export const ds18b20 = {
    defaults: () => ({
        gpio: 255,
        'state.values[0].name': 'Temperature',
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