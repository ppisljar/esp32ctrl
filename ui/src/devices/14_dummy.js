import {Device} from './_defs';

class Dummy extends Device {
    constructor() {
        super();

        this.params = {
            name: 'Config',
            configs: {
                add: { title: 'Add Variable', type: 'button', click: (a,form,config) => {
                    form.props.config.groups.params.configs['var'] = [
                        { name: 'Var 1 name', type: 'string', var: `state.values[0].name` },
                        { name: 'Type', type: 'select', options: [0, 1, 2, 3], var: `state.values[0].type` },
                        { name: 'Value', type: 'string', var: `state.values[0].value` },
                    ];
                    form.forceUpdate();
                }}
            }
        };

        this.vals = 0;
    }

    defaults = () => ({
        'state.values[0].name': 'Dummy',
        'state.values[0].type': 0,
        'state.values[0].value': 0,
    });
}

export const dummy = new Dummy();