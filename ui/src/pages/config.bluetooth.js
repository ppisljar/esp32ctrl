import { h, Component } from 'preact';
import { Form } from '../components/form';
import { settings } from '../lib/settings';
import { set } from '../lib/helpers';
import { pins } from '../lib/pins';

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
    
    return {
        groups: {
            params: {
                name: 'General Settings',
                configs: {
                    enabled: { name: 'Enabled', type: 'checkbox', var: 'enabled' },
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
