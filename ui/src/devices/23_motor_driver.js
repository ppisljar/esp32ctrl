import { getTasks, getTaskValues } from '../lib/utils';

export const MotorDriver = {
    defaults: () => ({
        'state.values[0].name': 'Output A',
        'state.values[0].type': '1',
        'state.values[1].name': 'Output B',
        'state.values[1].type': '1',
    }),
    params: {
        name: 'Configuration',
        configs: {
            gpio_a1: { name: 'GPIO A1', type: 'gpio', pins: () => window.io_pins.getPins('digital_out') },
            gpio_a2: { name: 'GPIO A2', type: 'gpio', pins: () => window.io_pins.getPins('digital_out') },
            gpio_b1: { name: 'GPIO B1', type: 'gpio', pins: () => window.io_pins.getPins('digital_out') },
            gpio_b2: { name: 'GPIO B2', type: 'gpio', pins: () => window.io_pins.getPins('digital_out') },
        }
    },
    vals: 2,
}