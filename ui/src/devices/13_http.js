import {Device} from './_defs';

class HTTP extends Device {
    constructor() {
        super();

        this.params = {
            name: 'Config',
            configs: {
                uri: { name: 'URI', type: 'string' },
                method: { name: 'Method', type: 'select', options: [
                    { name: 'GET', value: 0 },
                    { name: 'POST', value: 1 },
                ]},
                data: { name: 'Data', type: 'string' },
            }
        };
    }

    defaults = () => ({
        'params.uri': 'http://iot.eclipse.org/%device_name%/%value_name%/%value%',
        'params.type': 0,
        'params.data': '',
    });
}

export const http = new HTTP();