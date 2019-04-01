import { h, Component } from 'preact';
import { get, set, getKeys } from '../../lib/helpers';
import { settings } from '../../lib/settings';

const longToByteArray = function(/*long*/long) {
    // we want to represent the input as a 8-bytes array
    var byteArray = [0, 0, 0, 0, 0, 0, 0, 0];

    for ( var index = 0; index < byteArray.length; index ++ ) {
        var byte = long & 0xff;
        byteArray [ index ] = byte;
        long = (long - byte) / 256 ;
    }

    return byteArray;
};

const byteArrayToLong = function(/*byte[]*/byteArray) {
    var value = 0;
    for ( var i = byteArray.length - 1; i >= 0; i--) {
        value = (value * 256) + byteArray[i];
    }

    return value;
};

export class Form extends Component {
    constructor(props) {
        super(props);

        this.setProp = (prop, val) => {
            if (prop.startsWith('ROOT')) {
                settings.set(prop.replace('ROOT.', ''), val);
            } else {
                set(this.props.selected, prop, val);
            }
        }

        this.getProp = (prop) => {
            let currentValue;
            if (prop.startsWith('ROOT')) {
                currentValue = settings.get(prop.replace('ROOT.', ''));
            } else {
                currentValue = get(this.props.selected, prop);
            }
            return currentValue;
        }
        this.onChange = (id, prop, config = {}) => {
            return (e) => {
                let val = this.form.elements[id].value;
                if (config.type === 'checkbox') {
                    val =  this.form.elements[id].checked ? 1 : 0;
                } else if (config.type === 'number') {
                    val = parseFloat(val);
                } else if (config.type === 'select' || config.type === 'gpio') {
                    val = isNaN(val) ? val : parseInt(val);
                } else if (config.type === 'ip') {
                    const part = parseInt(id.split('.').pop());
                    const arr = longToByteArray(this.getProp(prop));
                    arr[part] = val;
                    val = byteArrayToLong(arr); 
                }
                this.setProp(prop, val);
                if (config.onChange) {
                    config.onChange(e, this, id, prop, val, config);
                }

                this.forceUpdate();
            }
        }
    }

    renderConfig(id, config, value, varName) {
        let options;
        switch (config.type) {
            case 'string':
                return (
                    <input id={id} type="text" value={value} onChange={this.onChange(id, varName, config)} />
                );
            case 'number':
                return (
                    <input id={id} type="number" value={value} min={config.min} max={config.max} onChange={this.onChange(id, varName, config)}/>
                ) ;
            case 'ip':
                const ip = value ? longToByteArray(value): [0,0,0,0];
                return [
                    (<input id={`${id}.0`} type="number" min="0" max="255" onChange={this.onChange(`${id}.0`, varName, config)} style="width: 80px" value={ip ? ip[0] : 0} />),
                    (<input id={`${id}.1`} type="number" min="0" max="255" onChange={this.onChange(`${id}.1`, varName, config)} style="width: 80px" value={ip ? ip[1] : 0} />),
                    (<input id={`${id}.2`} type="number" min="0" max="255" onChange={this.onChange(`${id}.2`, varName, config)} style="width: 80px" value={ip ? ip[2] : 0} />),
                    (<input id={`${id}.3`} type="number" min="0" max="255" onChange={this.onChange(`${id}.3`, varName, config)} style="width: 80px" value={ip ? ip[3] : 0} />)
                ]
            case 'password':
                return (
                    <input id={id} type="password" onChange={this.onChange(id, varName, config)} />
                ) ;
            case 'checkbox':
                return (
                    <input id={id} type="checkbox" defaultChecked={value} onChange={this.onChange(id, varName, config)} />
                ) ;
            case 'select':
                options = (typeof config.options === 'function') ? config.options(this.props.selected) : config.options;
                return (
                    <select id={id} onChange={this.onChange(id, varName, config )}>
                        {options.map(option => {
                            const name = option instanceof Object ? option.name : option;
                            const val = option instanceof Object ? option.value : option;
                            if (val === value) {
                                return (<option value={val} selected>{name}</option>)
                            } else {
                                return (<option value={val} disabled={option.disabled ? true : null}>{name}{option.disabled ? ` [${option.disabled}]` : ''}</option>);
                            }
                        })}
                    </select>
                ) ;
            case 'gpio':
                options = window.pins();
                const selectPin = (val, name, form) => {
                    const pins = window.pins();
                    const selectedPin = pins.find(pin => pin.value == val);
                    form.props.config.groups[name].configs = { ...selectedPin.configs }
                    form.forceUpdate();
                }
                return (
                    <select id={id} onChange={this.onChange(id, varName, { ...config, onChange: (e, form, id, prop, val, config) => {
                        selectPin(val, config.name.toLowerCase(), form);
                    }})}>
                        {options.map(option => {
                            const name = option instanceof Object ? option.name : option;
                            const val = option instanceof Object ? option.value : option;
                            if (val === value) {
                                return (<option value={val} selected>{name}</option>)
                            } else {
                                return (<option value={val} disabled={option.disabled ? true : null}>{name}{option.disabled ? ` [${option.disabled}]` : ''}</option>);
                            }
                        })}
                    </select>
                )
            case 'file':
                return (
                    <input id={id} type="file" />
                )
            case 'button':
                const clickEvent = () => {
                    if (!config.click) return;
                    config.click(this.props.selected, this, config);
                }
                return (
                    <button type="button" onClick={clickEvent}>{config.value}</button>
                );
        }
    }

    renderConfigGroup(id, configs, values) {
        const configArray = Array.isArray(configs) ? configs : [configs];
        const classes = `pure-control-group ${configArray.length === 3 ? 'group-3': ''}`

        return (
            <div className={classes}>
                {configArray.map((conf, i) => {
                    const varId = configArray.length > 1 ? `${id}.${i}` : id;
                    const varName = conf.var ? conf.var : varId;
                    const val = varName.startsWith('ROOT') ? settings.get(varName.replace('ROOT.', '')) : get(values, varName, null);

                    if (conf.if) {
                        const val = get(settings.settings, conf.if, false);
                        if (conf.ifval === undefined && !val) {
                            return (null);
                        }
                        if (conf.ifval != val) return (null);
                    }
                    if (conf.type === 'custom') {
                        const CustomComponent = conf.component;
                        return (<CustomComponent conf={conf} values={values} />);
                    }
                    return [
                        (<label for={varId}>{conf.name}</label>),
                        this.renderConfig(varId, conf, val, varName)
                    ];
                })}
            </div>
        )
    }

    renderGroup(id, group, values) {
        if (!group.configs || !Object.keys(group.configs).length) return (null);
        const keys = getKeys(group.configs);
        return (
            <fieldset name={id}>
                <label>{group.name}</label>
                {keys.map(key => {
                    const conf = group.configs[key];
                    if (conf.adminOnly && settings.userName !== 'admin') return (null);
                    return this.renderConfigGroup(`${id}.${key}`, conf, values);
                })}
            </fieldset>
        )
    }

    render(props) {
        const keys = getKeys(props.config.groups);
        return (<form class="pure-form pure-form-aligned" ref={ref => this.form = ref}>
            {keys.map(key => this.renderGroup(key, props.config.groups[key], props.selected))}
        </form>)
    }
}