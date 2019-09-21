import {Device} from './_defs';

const valueTypes = [
    { name: 'Bit', value: 4 },
    { name: 'Byte', value: 0 },
    { name: 'Integer', value: 1 },
    { name: 'Decimal', value: 2 },
    { name: 'String', value: 3 },
]

class Dummy extends Device {
    constructor() {
        super();
        this.vals = 0;
    }

    getConfigProps = (vals) => {
        const result = {};
        vals.forEach((val, i) => {
            if (!val) return;
            result['config_' + i] = [
                { name: `Var ${i} name`, type: 'string', var: `params.values[${i}].name` },
                { name: 'Type', type: 'select', options: valueTypes, var: `params.values[${i}].type` },
                { name: 'String', if: `params.values[${i}].type`, ifval:3, type: 'string', var: `params.values[${i}].val` },
                { name: 'Decimal', if: `params.values[${i}].type`, ifval:2, type: 'number', step:.01, var: `params.values[${i}].val` },
                { name: 'Byte', if: `params.values[${i}].type`, ifval:0, type: 'number', min: 0, max: 255, var: `params.values[${i}].val` },
                { name: 'Bit', if: `params.values[${i}].type`, ifval:4, type: 'checkbox', var: `params.values[${i}].val` },
                { name: 'Int', if: `params.values[${i}].type`, ifval:1, type: 'number', min: 0, max: 65535, var: `params.values[${i}].val` },
                { type: 'button', value: 'X', click: (event, form) => {
                    const conf = form.props.selected;
                    conf.params.values[i] = null;
                    form.props.config.groups.params = this.getFields(conf).params;
                    form.forceUpdate();
                }}
            ];
        });
        return result;
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
        const configs = conf.params ? conf.params.values || [] : [];
        return {
            params: {
                name: 'Config',
                configs: {
                    ...this.getConfigProps(configs),
                    add_config: { value: 'Add Config', type: 'button', click: (event, form) => {
                        const empty = conf.params.values.findIndex(e => e === null);
                        const defaultVarConf = { name: 'Dummy', type: 0, value: 0 };
                        if (empty !== -1) conf.params.values[empty] = defaultVarConf;
                        else conf.params.values.push(defaultVarConf);
                        form.props.config.groups.params = this.getFields(conf).params;
                        form.forceUpdate();
                    }},
                    ...this.getValueProps(values),
                    add_state: { value: 'Add State', type: 'button', click: (event, form) => {
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
        'params.values[0].name': 'Dummy',
        'params.values[0].type': 0,
        'params.values[0].value': 0,
        'state.values[0].name': 'Dummy',
        'state.values[0].type': 0,
        'state.values[0].value': 0,
    });
}

export const dummy = new Dummy();