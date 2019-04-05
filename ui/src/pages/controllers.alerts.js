import { h, Component } from 'preact';
import { Form } from '../components/form';
import { settings } from '../lib/settings';
import { set } from '../lib/helpers';
import { getTaskValues, getTasks } from '../lib/utils';

export const types = [
    { name: '- None -', value: 0 },
    { name: 'Email', value: 1 },
    { name: 'Buzzer', value: 2 },
];

const compareOptions = [
    { name: '=', value: 0 },
    { name: '>', value: 1 },
    { name: '<', value: 2 },
    { name: '<>', value: 3 },
]

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
    const alerts = {};
    
    config.alerts.forEach((alert, i) => {
        alerts[`${i}_name`] = [{
            name: 'Name',
            value: alert.name,
            type: 'string',
            var: `alerts[${i}].name`,
        }, {
            name: 'Description',
            value: alert.description,
            type: 'string',
            var: `alerts[${i}].description`,
        }, {
            type: 'button',
            click: () => {
                config.alerts.splice(i, 1);
                form.forceUpdate();
            }
        }];
        alerts[`${i}_check`] = [
            { name: 'Check Device', type: 'select', options: getTasks, var: `alerts[${i}].checks[0].device_id` },
            //{ name: 'Check Value', type: 'select', options: getTaskValues, var: `alerts[${i}].checks[0].value_id` },
        ];
        alerts[`${i}_compare`] = [
            { name: 'Comparison', type: 'select', options: compareOptions, var: `alerts[${i}].checks[0].compare` },
            { name: 'Value', type: 'string', var: `alerts[${i}].checks[0].value` },
        ];
    });
    
    return {
        groups: {
            params: {
                name: 'Settings',
                configs: {
                    enabled: { name: 'Enabled', type: 'checkbox', var: 'enabled' },
                    ...alerts,
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
export class ControllerAlertsPage extends Component {
    constructor(props) {
        super(props);

        this.config = settings.get(`alerts`);
        if (!this.config) {
            this.config =  { enabled: false, alerts: [] };
            settings.set('alerts', this.config);
        }

        this.addTrigger = () => {
            this.config.alerts.push({
                name: 'New Alert',
                type: 0,
                idx: firstFreeKey(this.config.alerts),
            });
            this.forceUpdate();
        }
    }

    render(props) {
        
        const formConfig = getFormConfig(this.config, this);
        
        return (
            <div>
                <Form config={formConfig} selected={this.config} />
                <button type="button" onClick={this.addTrigger}>Add Alert</button>
            </div>
        );
    }
}
