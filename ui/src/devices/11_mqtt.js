import {Device} from './_defs';

class MQTT extends Device {
    constructor() {
        super();

        this.params = {
            name: 'Config',
            configs: {
                uri: { name: 'URI', type: 'string' },
                user: { name: 'Username', type: 'string' },
                pass: { name: 'Password', type: 'string' },
                lwt_topic: { name: 'LWT Topic', type: 'string' },
                lwt_msg: { name: 'LWT Message', type: 'string' },
            }
        };
    }

    defaults = () => ({
        'params.uri': 'mqtt://iot.eclipse.org',
    });
}

export const mqtt = new MQTT();