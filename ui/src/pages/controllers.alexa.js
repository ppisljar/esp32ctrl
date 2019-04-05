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
    const triggers = {};
    
    config.triggers.forEach((trigger, i) => {
        triggers[`${i}_name`] = [{
            name: 'Name',
            value: trigger.name,
            type: 'string',
            var: `triggers[${i}].name`,
        }, {
            name: 'Type',
            value: trigger.type,
            type: 'select',
            options: [{ name: 'switch', value: 0 }, { name: 'dimmer', value: 1 }, { name: 'color', value: 2 }, { name: 'color2', value: 3 }, { name: 'color3', value: 4 }],
            var: `triggers[${i}].type`,
        }, {
            type: 'button',
            value: 'remove',
            click: () => {
                config.triggers.splice(i, 1);
                form.forceUpdate();
            }
        }];
    });
    
    return {
        groups: {
            params: {
                name: 'Settings',
                configs: {
                    enabled: { name: 'Enabled', type: 'checkbox', var: 'enabled' },
                    ...triggers,
                }
            },
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
export class ControllerAlexaPage extends Component {
    constructor(props) {
        super(props);

        this.config = settings.get(`alexa`);
        if (!this.config) {
            this.config =  { enabled: false, triggers: [] };
            settings.set('alexa', this.config);
        }

        this.addTrigger = () => {
            this.config.triggers.push({
                name: 'New Trigger',
                type: 0,
                idx: firstFreeKey(this.config.triggers),
            });
            this.forceUpdate();
        }
    }

    render(props) {
        
        const formConfig = getFormConfig(this.config, this);
        
        return (
            <div>
                <Form config={formConfig} selected={this.config} />
                <button type="button" onClick={this.addTrigger}>Add Trigger</button>
            </div>
        );
    }
}
