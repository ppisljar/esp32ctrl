import { h, Component } from 'preact';
import { Form } from '../components/form';
import { settings } from '../lib/settings';
import { devices } from '../devices';
import { set } from '../lib/helpers';

const baseFields = { 
    enabled: { name: 'Enabled', type: 'checkbox', var: 'enabled' },
    name: { name: 'Name', type: 'string', var: 'name' },
    idx: { name: 'Idx', type: 'string', var: 'idx' },
    icon: { name: 'Icon', type: 'string', var: 'icon', extra: { 'class': 'iconpicker' }},
    lock: { name: 'Lock', type: 'checkbox', var: 'lock', adminOnly: true },
};

const getFormConfig = (type, config) => {
    const device = devices.find(d => d.value === parseInt(type));
    if (!device) return null;

    const dataAcquisitionForm = device.fields.data ? {
        name: 'Data Acquisition',
        configs: {
            send1: { name: 'Send to Controller 1', type: 'checkbox', var: 'TaskDeviceSendData[0]', if: 'controllers[0].enabled' },
            send2: { name: 'Send to Controller 2', type: 'checkbox', var: 'TaskDeviceSendData[1]', if: 'controllers[1].enabled' },
            send3: { name: 'Send to Controller 3', type: 'checkbox', var: 'TaskDeviceSendData[2]', if: 'controllers[2].enabled' },
            idx1: { name: 'IDX1', type: 'number', var: 'TaskDeviceID[0]', if: 'controllers[0].enabled' },
            idx2: { name: 'IDX2', type: 'number', var: 'TaskDeviceID[1]', if: 'controllers[1].enabled' },
            idx3: { name: 'IDX3', type: 'number', var: 'TaskDeviceID[2]', if: 'controllers[2].enabled' },
            interval: { name: 'Interval', type: 'number', var: 'interval' },
        }
    }: {};
       
    return {
        groups: {
            settings: {
                name: 'Device Settings',
                configs: {
                    type: { name: 'Type', type: 'select', var: 'type', options: devices },
                    ...baseFields,
                    
                }
            },
            ...device.fields.getFields ? device.fields.getFields(config) : device.fields,
            data: dataAcquisitionForm,
            values: {
                name: 'Values',
                configs: {
                    ...[...new Array(device.fields.vals || 0)].reduce((acc, x, i) => {
                        acc[`value${i}`] = [
                            { name: `Name ${i+1}`, var: `state.values[${i}].name`, type: 'string' }, 
                            { name: `Formula ${i+1}`, var: `state.values[${i}].formula`, type: 'string' },
                        ];
                        return acc;
                    }, {})
                }
            }
        },
    }
}

const setDefaultConfig = (type, config) => {
    const device = devices.find(d => d.value === parseInt(type));
    const fields = device.fields.getFields ? device.fields.getFields(config) : device.fields;

    Object.keys(fields).forEach((groupKey) => {
        const group = fields[groupKey];
        if (!group.configs) return;
        Object.keys(group.configs).forEach((configKey) => {
            const cfg = group.configs[configKey];
            const key = cfg.var || `${groupKey}.${configKey}`;
            let val = 0;
            if (cfg.type === 'string') val = '';
            else if (cfg.type === 'ip') val = [0, 0, 0, 0];
            set(config, key, val);
        });
    });
    config.state = {};
    if (device.fields.defaults) {
        const defaultConfig = device.fields.defaults();
        Object.keys(defaultConfig).forEach(key => {
            const val = defaultConfig[key];
            set(config, key, val);    
        })
    }
    
}

// todo: changing protocol needs to update:
// -- back to default (correct default)
// -- field list 
export class DevicesEditPage extends Component {
    constructor(props) {
        super(props);

        this.config = settings.get(`plugins[${props.params[0]}]`);
        this.state = {
            type: this.config.type,
        }
    }

    render(props) {
        const formConfig = getFormConfig(this.state.type, this.config);
        if (!formConfig) {
            alert('something went wrong, cant edit device');
            window.location.href='#devices';
        }
        formConfig.groups.settings.configs.type.onChange = (e) => {
            this.setState({ type: e.currentTarget.value });
            setDefaultConfig(e.currentTarget.value, this.config);
        };
        return (
            <Form config={formConfig} selected={this.config} />
        );
    }
}
