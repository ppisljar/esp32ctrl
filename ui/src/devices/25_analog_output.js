import { getTasks, getTaskValues } from '../lib/utils';

export const AnalogOutput = {
    defaults: () => ({
        'state.values[0].name': 'Output',
        'state.values[0].type': '1',
    }),
    params: {
        name: 'Configuration',
        configs: {
            gpio: { name: 'GPIO', type: 'gpio', pins: () => window.io_pins.getPins('digital_out').filter(pin => pin.value == 25 || pin.value == 26) },
        }
    },
    vals: 1,
}