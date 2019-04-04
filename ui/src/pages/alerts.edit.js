import { h, Component } from 'preact';
import { Form } from '../components/form';
import { settings } from '../lib/settings';
import { getTasks, getTaskValues } from '../lib/pins';

const baseFields = { 
    enabled: { name: 'Enabled', type: 'checkbox', var: 'enabled' },
    name: { name: 'Name', type: 'string', var: 'name' },
    description: { name: 'Description', type: 'string', var: 'description' },
    icon: { name: 'Icon', type: 'string', var: 'icon' },
};

const compareOptions = [
    { name: '=', value: 0 },
    { name: '>', value: 1 },
    { name: '<', value: 2 },
    { name: '<>', value: 3 },
]

const getFormConfig = (config, form) => {
    const triggers = {};
    config.triggers.forEach((trigger, i) => {
        triggers[`${i}_check`] = [
            { name: 'Check Device', type: 'select', value: trigger.device_id, options: getTasks, var: `triggers[${i}].device_id` },
            //{ name: 'Check Value', type: 'select', options: getTaskValues, var: `alerts[${i}].value_id` },
            { type: 'button', click: () => {
                config.triggers.splice(i, 1);
                form.forceUpdate();
            }},
        ];
        triggers[`${i}_compare`] = [
            { name: 'Comparison', type: 'select', value: trigger.compare, options: compareOptions, var: `triggers[${i}].compare` },
            { name: 'Value', type: 'string', value: trigger.value, var: `triggers[${i}].value` },
        ];
    });

    return {
        groups: {
            settings: {
                name: 'Alert Settings',
                configs: {
                    ...baseFields,
                    
                }
            },
            triggers: {
                name: 'Conditions',
                configs: {
                    ...triggers,
                    add: { type: 'button', click: () => {
                        form.addTrigger();
                    }},
                }
            }
        },
    }
}

export class AlertsEditPage extends Component {
    constructor(props) {
        super(props);

        this.config = settings.get(`alerting.alerts[${props.params[0]}]`);

        this.addTrigger = () => {
            this.config.triggers.push({});
            this.forceUpdate();
        }
    }

    render(props) {
        const formConfig = getFormConfig(this.config, this);
        if (!formConfig) {
            alert('something went wrong, cant edit device');
            window.location.href='#alerts';
        }
        return (
            <Form config={formConfig} selected={this.config} />
        );
    }
}
