import { getTasks, getTaskValues } from '../lib/utils';

export const PIDLevelControl = {
    defaults: () => ({
        'state.values[0].name': 'Output',
        'state.values[0].type': '1',
    }),
    params: {
        name: 'Configuration',
        configs: {
            device: { name: 'Check Device', type: 'select', options: getTasks },
            value: { name: 'Check Value', type: 'select', options: getTaskValues('params.device') },
            level: { name: 'Set Level', type: 'number' },
            interval: { name: 'Interval', type: 'number' },
            p: { name: 'P', type: 'number' },
            i: { name: 'I', type: 'number' },
            d: { name: 'D', type: 'number' },
            f: { name: 'V', type: 'number' },
        }
    },
    vals: 1,
}