import { h, Component } from 'preact';
import { Form } from '../components/form';
import { settings } from '../lib/settings';
import { set } from '../lib/helpers';
import { pins } from '../lib/pins';
import { getTasks, getTaskValues } from '../lib/utils';

export const types = [
    { name: '- None -', value: 0 },
    { name: 'Email', value: 1 },
    { name: 'Buzzer', value: 2 },
];

const baseDefaults = {}
const getDefaults = {
    0: () => ({}),
    1: () => ({ // Email
    }), 2: () => ({ // Buzzer
    }),
}

const setDefaultConfig = (type, config) => {
    const defaults = {...baseDefaults, ...getDefaults[type]()};
    Object.keys(defaults).forEach((key) => {
        const val = defaults[key];
        set(config.settings, key, val);
    });
}

const getFormConfig = (config, form) => {
    const values = {};
    const beacon = {};
    
    config.beacon.values.forEach((trigger, i) => {
        beacon[`${i}_name`] = [
            { name: 'Check Device', type: 'select', options: getTasks, var: `beacon.values[${i}].device`, },
            { name: 'Check Value', type: 'select', options: getTaskValues(`beacon.values[${i}].device`), var: `beacon.values[${i}].value` },
            {
                type: 'button',
                value: 'remove',
                click: () => {
                    config.beacon.values.splice(i, 1);
                    form.forceUpdate();
                }
            }];
    });

    config.server.values.forEach((trigger, i) => {
        values[`${i}_name`] = [{
            name: 'Name',
            value: trigger.name,
            type: 'string',
            var: `server.values[${i}].name`,
        }, {
            name: 'Type',
            value: trigger.type,
            type: 'select',
            options: [{ name: 'byte', value: 0 }],
            var: `server.values[${i}].type`,
        }, {
            type: 'button',
            value: 'remove',
            click: () => {
                config.server.values.splice(i, 1);
                form.forceUpdate();
            }
        }];
    });

    const addDevice = () => {
        config.beacon.values.push({
            device: 'New Value',
            value: 0,
            idx: firstFreeKey(config.beacon.values),
        });
        form.forceUpdate();
    }

    const bytesLeft = () => {
        let total = 0;
        config.beacon.values.forEach(v => {
            // get value length
            total += 1;
        });
        const bl = 20-total;
        return `${bl} bytes left`;
    }
    
    return {
        groups: {
            params: {
                name: 'General Settings',
                configs: {
                    enabled: { name: 'Enabled', type: 'checkbox', var: 'enabled' },
                }
            },
            beacon: {
                name: 'Bluetooth Beacon',
                configs: {
                    enabled: { name: 'Enabled', type: 'checkbox' },
                    type: { name: 'Type', type: 'select', options: ['name', 'custom']},
                    ...beacon,
                    btn: { name: bytesLeft, value: 'add device value', type: 'button', click: addDevice }
                }
            },
            server: {
                name: 'Bluetooth LE Device',
                configs: {
                    enabled: { name: 'Enabled', type: 'checkbox' },
                    name: { name: 'Name', type: 'string' },
                    ...values,
                }
            }
        },
    }
}

const firstFreeKey = ($array) => {
  let i = 0;
  while($array.find(e => e.idx == i)) i++;
  return i;
}

// todo: changing protocol needs to update:
// -- back to default (correct default)
// -- field list 
export class ConfigBluetoothPage extends Component {
    constructor(props) {
        super(props);

        this.config = settings.get(`bluetooth`);
        if (!this.config) {
            this.config =  { enabled: false, server: { enabled: false, values: [] } };
            settings.set('bluetooth', this.config);
        }

        if (!this.config.beacon) this.config.beacon = { values: [] };

        this.addTrigger = () => {
            this.config.server.values.push({
                name: 'New Value',
                type: 0,
                idx: firstFreeKey(this.config.server.values),
            });
            this.forceUpdate();
        }
    }

    render(props) {
        
        const formConfig = getFormConfig(this.config, this);
        
        return (
            <div>
                <Form config={formConfig} selected={this.config} />
                <button type="button" onClick={this.addTrigger}>Add Value</button>
            </div>
        );
    }
}
