
export const analog = {
    defaults: () => ({
        'params.gpio': 255,
        'params.interval': 60,
        'params.samples': 1,
        'state.values[0].name': 'Analog',
        'state.values[0].type': '2',
        'state.values[0].readonly': '1',
        'state.values[0].device_class': 'current',
        'state.values[0].unit': 'A',
    }),
    params: {
        name: 'Settings',
        configs: {
            gpio: { name: 'GPIO', type: 'select', options: () => (window.io_pins.getPins('analog_in')) },
            interval: { name: 'Interval', type: 'number', min: 0, max: 3600*24 },
            notify_interval: { name: 'Notify interval', type: 'number', min: 0, max: 3600*24 },
            ac: { name: 'Average AC', type: 'checkbox' },
            samples: { name: 'Samples', type: 'number', min: 1, max: 1000 }
        }
    },
    data: false,
    vals: 1,
}