import {Device} from './_defs';

const valueTypes = [
    { name: 'Bit', value: 0 },
    { name: 'Byte', value: 1 },
    { name: 'Int16', value: 2 },
    { name: 'Int32', value: 4 },
    { name: 'String', value: 5 },
]

class Dummy extends Device {
    constructor() {
        super();
        this.vals = 0;
    }

    getValueProps = (vals) => {
        const result = {};
        vals.forEach((val, i) => {
            if (!val) return;
            result['value_' + i] = [
                { name: `Var ${i} name`, type: 'string', var: `state.values[${i}].name` },
                { name: 'Type', type: 'select', options: valueTypes, var: `state.values[${i}].type` },
                { type: 'button', value: 'X', click: (event, form) => {
                    const conf = form.props.selected;
                    conf.state.values[i] = null;
                    form.props.config.groups.params = this.getFields(conf).params;
                    form.forceUpdate();
                }}
            ];
        });
        return result;
    }

    getFields = (conf) => {
        const values = conf.state ? conf.state.values || [] : [];
        return {
            params: {
                name: 'Config',
                configs: {
                    ...this.getValueProps(values),
                    add: { value: 'Add Variable', type: 'button', click: (event, form) => {
                        const empty = conf.state.values.findIndex(e => e === null);
                        const defaultVarConf = { name: 'Dummy', type: 0, value: 0 };
                        if (empty !== -1) conf.state.values[empty] = defaultVarConf;
                        else conf.state.values.push(defaultVarConf);
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