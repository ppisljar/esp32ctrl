const addrOption = [
    { value: 16, name: '0x10' }, 
]

export const vwml6040 = {
    defaults: () => ({
        'state.values[0].name': 'R',
        'state.values[0].type': '2',
        'state.values[1].name': 'G',
        'state.values[1].type': '2',
        'state.values[1].name': 'B',
        'state.values[1].type': '2',
        'state.values[1].name': 'W',
        'state.values[1].type': '2',
        'state.values[1].name': 'Lux',
        'state.values[1].type': '5',
        'params.addr': 0x10,
    }),
    params: {
        name: 'Configuration',
        configs: {
            addr: { name: 'Address', type: 'select', options: addrOption },
            interval: { name: 'Interval', type: 'number' },
        }
    },
    data: false,
    vals: 5,
}