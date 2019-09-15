import { h, Component } from 'preact';
import { Form } from '../components/form';
import { settings } from '../lib/settings';
import { getTasks, getTaskValues } from '../lib/utils';

const typeOptions = [
    { name: 'time: seconds', value: 0 },
    { name: 'manual steps', value: 99 },
]

const baseFields = { 
    name: { name: 'Name', type: 'string', var: 'name' },
    description: { name: 'Description', type: 'string', var: 'description' },
    icon: { name: 'Icon', type: 'string', var: 'icon' },
    type: { name: 'Type', type: 'select', options: typeOptions }
};

const getFormConfig = (config, form) => {
    const steps = {};
    config.steps.forEach((step, i) => {

        const configs = {};
        step.configs.forEach((cfg, j) => {
            configs[`${j}_prop`] = [
                { name: 'Device', type: 'select', value: cfg.device, options: getTasks, var: `steps[${i}].configs[${j}].device` },
                { name: 'Config', type: 'select', value: cfg.value_id, options: getTaskValues(`steps[${i}].configs[${j}].device`), var: `steps[${i}].configs[${j}].value_id` },
                { type: 'button', value: 'remove', click: () => {
                    step.configs.splice(i, 1);
                    form.forceUpdate();
                }},
            ];
        });
        
        steps[`step_${i}`] = {
            name: `Step ${i}`,
            configs: {
                opts: [
                    { name: 'number', type: 'number', value: i, var: `steps[${i}].number` },
                    { type: 'button', value: 'remove', click: () => {
                        config.steps.splice(i, 1);
                        form.forceUpdate();
                    }},
                ],
                ...configs,
                add: { type: 'button', value: 'add config', click: () => {
                    step.configs.push({});
                    form.forceUpdate();
                }},
            }
        };
        
    });

    return {
        groups: {
            settings: {
                name: 'Profile Settings',
                configs: {
                    ...baseFields,
                    add: { type: 'button', value: 'add step', click: () => {
                        form.addStep();
                    }},
                }
            },
            ...steps,
        },
    }
}

export class ProfilesEditPage extends Component {
    constructor(props) {
        super(props);

        this.config = settings.get(`profiles[${props.params[0]}]`);

        this.addStep = () => {
            this.config.steps.push({ configs: [] });
            this.forceUpdate();
        }
    }

    render(props) {
        const formConfig = getFormConfig(this.config, this);
        if (!formConfig) {
            alert('something went wrong, cant edit profile');
            window.location.href='#profiles';
        }
        return (
            <Form config={formConfig} selected={this.config} />
        );
    }
}
