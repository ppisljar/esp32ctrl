
export const analog = {
    defaults: () => ({
        'params.gpio': 255
    }),
    params: {
        name: 'Settings',
        configs: {
            gpio: { name: 'GPIO', type: 'select', options: () => (window.io_pins.getPins('analog_in')) }
        }
    },
    data: false,
    vals: 0,
}