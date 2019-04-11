import {Device} from './_defs';

class Dimmer extends Device {
    constructor() {
        super();
        this.vals = 0;
    }

    getValueProps = (vals) => {
        const result = {};
        vals.forEach((val, i) => {
            if (!val) return;
            result['output_' + i] = [
                { name: `Output ${i}`, type: 'gpio', var: `params.outputs[${i}]` },
                { type: 'button', value: 'X', click: (event, form) => {
                    const conf = form.props.selected;
                    conf.params.outputs.splice(i, 1);
                    conf.state.values.splice(i, 1);
                    this.vals--;
                    form.props.config.groups.params = this.getFields(conf).params;
                    form.forceUpdate();
                }}
            ];
        });
        return result;
    }

    getFields = (conf) => {
        const outputs = conf.params ? conf.params.outputs || [] : [];
        return {
            params: {
                name: 'Config',
                configs: {
                    gpio_zc: { name: 'GPIO ZC', type: 'gpio' },
                    ...this.getValueProps(outputs),
                    add: { value: 'Add Output', type: 'button', click: (event, form) => {
                        conf.params.outputs.push(255);
                        conf.state.values.push({ name: `SW${conf.state.values.length + 1}`})
                        form.props.config.groups.params = this.getFields(conf).params;
                        this.vals++;
                        form.forceUpdate();
                    }}
                }
            }
        }
    }

    defaults = () => ({
        'params.outputs[0]': 255,
        'params.gpio_zc': 255,
        'state.values[0].name': 'SW1',
        'state.values[1].name': 'SW2',
    });
}

export const dimmer = new Dimmer();