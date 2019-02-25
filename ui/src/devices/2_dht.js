import { pins } from './_defs';

const sensorModel = [
    { value: 11, name: 'DHT11' }, 
    { value: 22, name: 'DHT22' }, 
    { value: 12, name: 'DHT12' }, 
    { value: 23, name: 'Sonoff am2301' }, 
    { value: 70, name: 'Sonoff si7021' },
]

export const dht = {
    defaults: () => ({
        'params.gpio': 255,
        'params.type': 0,
        'settings.values[0].name': 'Temperature',
        'settings.values[1].name': 'Humidity',
    }),
    params: {
        name: 'Configuration',
        configs: {
            gpio: { name: 'GPIO Data', type: 'select', options: pins },
            type: { name: 'Sensor model', type: 'select', options: sensorModel },
        }
    },
    data: false,
    vals: 2,
}