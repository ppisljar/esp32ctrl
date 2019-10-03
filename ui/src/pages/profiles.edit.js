import { h, Component } from 'preact';
import { Form } from '../components/form';
import { settings } from '../lib/settings';
import {getTasks, getTaskConfigs, getTaskValues, getTaskValueType, getTaskConfigObj } from '../lib/utils';

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

const compareValue = (device, type) => {
    const checkValue = getTaskValueType(`${device}.device`, `${device}.value_id`, type);
    return (config) => {
        return checkValue(config);
    }
}

const getFormConfig = (config, form) => {
    const steps = {};
    config.steps.forEach((step, i) => {

        const configs = {};
        step.configs.forEach((cfg, j) => {
            const valueObj = getTaskConfigObj(cfg.device, cfg.value_id);
            configs[`${j}_prop`] = [
                { name: 'Device', type: 'select', value: cfg.device, options: getTasks, var: `steps[${i}].configs[${j}].device` },
                { name: 'Config', type: 'select', value: cfg.value_id, options: getTaskConfigs(`steps[${i}].configs[${j}].device`), var: `steps[${i}].configs[${j}].value_id`, onChange: () => { form.forceUpdate(); } },
                { ...valueObj, var: `steps[${i}].configs[${j}].value` },
                { type: 'button', value: 'remove', click: () => {
                    step.configs.splice(i, 1);
                    form.forceUpdate();
                }},
            ];
        });

        const states = {};
        step.states.forEach((cfg, j) => {
            const isBit = compareValue(`steps[${i}].states[${j}]`, 4);
            const isByte = compareValue(`steps[${i}].states[${j}]`, 0);
            const isInt16 = compareValue(`steps[${i}].states[${j}]`, 1);
            const isInt32 = compareValue(`steps[${i}].states[${j}]`, 2);
            const isString = compareValue(`steps[${i}].states[${j}]`, 3);

            states[`${j}_state`] = [
                { name: 'Device', type: 'select', value: cfg.device, options: getTasks, var: `steps[${i}].states[${j}].device` },
                { name: 'Config', type: 'select', value: cfg.value_id, options: getTaskValues(`steps[${i}].states[${j}].device`), var: `steps[${i}].states[${j}].value_id` },
                { name: 'Value', if: isString, type: 'string', var: 'params.val' },
                { name: 'Value', if: isBit, type: 'select', options: [0, 1], var: `steps[${i}].states[${j}].value` },
                { name: 'Value', if: isByte, type: 'number', min: 0, max: 255, var: `steps[${i}].states[${j}].value` },
                { name: 'Value', if: isInt16, type: 'number', min: 0, max: 65535, var: `steps[${i}].states[${j}].value` },
                { name: 'Value', if: isInt32, type: 'number', min: 0, max: 4294967295, var: `steps[${i}].states[${j}].value` },
                { type: 'button', value: 'remove', click: () => {
                    step.states.splice(i, 1);
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
                ...states,
                addConfig: { type: 'button', value: 'add config', click: () => {
                    step.configs.push({});
                    form.forceUpdate();
                }},
                addState: { type: 'button', value: 'add state', click: () => {
                    step.states.push({});
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
            this.config.steps.push({ configs: [], states: [] });
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
