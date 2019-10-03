
export const analog = {
    defaults: () => ({
        'params.gpio': 255,
        'params.interval': 60,
        'state.values[0].name': 'Analog',
        'state.values[0].type': '2',
        'state.values[0].readonly': '1',
    }),
    params: {
        name: 'Settings',
        configs: {
            gpio: { name: 'GPIO', type: 'select', options: () => (window.io_pins.getPins('analog_in')) },
            interval: { name: 'Interval', type: 'number', min: 0, max: 3600*24 }
        }
    },
    data: false,
    vals: 1,
}