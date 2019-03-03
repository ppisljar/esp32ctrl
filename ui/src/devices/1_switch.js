import { pins } from './_defs';

export const inputSwitch = {
    defaults: () => ({
        gpio: 255,
        interval: 60,
        'settings.values[0].name': 'Switch',
    }),
    params: {
        name: 'Configuration',
        configs: {
            pullup: { name: 'Internal PullUp', type: 'checkbox' },
            inversed: { name: 'Inversed logic', type: 'checkbox' },
            gpio: { name: 'GPIO', type: 'select', options: pins },
            interval: { name: 'Interval', type: 'number' },
            send_boot_state: { name: 'Send Boot State', type: 'checkbox' },
        }
    },
    vals: 1,
}