import {Device} from './_defs';

const getValueProps = (vals) => {
    const result = {};
    vals.forEach((val, i) => {
        result['value_' + i] = [
            { name: `Var ${i} name`, type: 'string', var: `state.values[${i}].name` },
            { name: 'Type', type: 'select', options: [0, 1, 2, 3], var: `state.values[${i}].type` },
        ];
    });
    return result;
}

class Dummy extends Device {
    constructor() {
        super();
        this.vals = 0;
    }

    getFields = (conf) => {
        const values = conf.state ? conf.state.values || [] : [];
        return {
            params: {
                name: 'Config',
                configs: {
                    ...getValueProps(values),
                    add: { title: 'Add Variable', type: 'button', click: (a,form,config) => {
                        conf.state.values.push({ name: 'Dummy', type: 0, value: 0 });
                        form.props.config.groups.params = this.getFields(conf).params;
                        form.forceUpdate();
                    }}
                }
            }
        }
    }

    defaults = () => ({
        'state.values[0].name': 'Dummy',
        'state.values[0].type': 0,
        'state.values[0].value': 0,
    });
}

export const dummy = new Dummy();