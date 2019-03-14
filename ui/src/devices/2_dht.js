const sensorModel = [
    { value: 0, name: 'DHT11' }, 
    { value: 1, name: 'DHT22' }, 
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
            gpio: { name: 'GPIO Data', type: 'gpio' },
            type: { name: 'Sensor model', type: 'select', options: sensorModel },
            interval: { name: 'Interval', type: 'number' },
        }
    },
    data: false,
    vals: 2,
}