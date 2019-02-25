import { pins } from './_defs';

export const ds18b20 = {
    defaults: () => ({
        gpio: 255,
        'settings.values[0].name': 'Temperature',
    }),
    sensor: {
        name: 'Sensor',
        configs: {
            gpio: { name: 'GPIO', type: 'select', options: pins },
        }
    },
    vals: 1,
}