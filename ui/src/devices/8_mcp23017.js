const i2cAddr = [
    { value: 0, name: 'Disabled' },
    { value: 1, name: 'Active on LOW' },
]

export const mcp23017 = {
    defaults: () => ({
        gpio1: 255,
        gpio2: 255,
        'settings.values[0].name': 'Tag',
    }),
    params: {
        name: 'Sensor',
        configs: {
            addr: { name: 'Address', type: 'select', options: i2cAddr }
        }
    },
    data: true,
}