import { getTasks, getTaskValues } from '../lib/utils';

export const levelControl = {
    defaults: () => ({
        'state.values[0].name': 'Output',
    }),
    params: {
        name: 'Configuration',
        configs: {
            device: { name: 'Check Device', type: 'select', options: getTasks },
            value: { name: 'Check Value', type: 'select', options: getTaskValues('params.device') },
            level: { name: 'Set Level', type: 'number' },
            hysteresis: { name: 'Hysteresis', type: 'number' },
            interval: { name: 'Interval', type: 'number' },
        }
    },
    vals: 1,
}