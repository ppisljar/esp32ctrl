import {Device} from './_defs';

const mqttTypes = [
    { name: 'OpenHAB', value: 0 },
    { name: 'Domoticz', value: 1 },
    { name: 'PIDome', value: 2 },
    { name: 'Home Assistant', value: 3 },
]

class MQTT extends Device {
    constructor() {
        super();

        this.params = {
            name: 'Config',
            configs: {
                uri: { name: 'URI', type: 'string' },
                type: { name: 'Type', type: 'select', options: mqttTypes, onChange: (e, form, id, prop, val, config) => {
                    switch (val) {
                        case 0: // Open HAB
                            form.setProp('params.subscribe_topic', '/%sysname%/#');
                            form.setProp('params.subscribe_data', '{ "val": %d }');
                            form.setProp('params.publish_topic', '/%sysname%/%tskname%/%valname%');
                            form.setProp('params.pubish_data', '{ "idx": %idx%, "nvalue": 0, "svalue": %value% }');
                            break;
                        case 1: // Domoticz
                            form.setProp('params.subscribe_topic', 'domoticz/out');
                            form.setProp('params.subscribe_data', '{ "idx": %idx%, "nvalue": 0, "svalue": %value% }');
                            form.setProp('params.publish_topic', 'domoticz/in');
                            form.setProp('params.pubish_data', '{ "idx": %idx%, "nvalue": 0, "svalue": %value% }');
                            break;
                        case 2: // PiDome
                            break;
                        case 3: // Home Assistant
                            form.setProp('params.subscribe_topic', 'homeassistant/%unit_id%/%device_name%/%value_name%');
                            form.setProp('params.subscribe_data', '%value%');
                            form.setProp('params.publish_topic', 'homeassistant/%unit_id%/%device_name%/%value_name%/status');
                            form.setProp('params.pubish_data', '%value%');
                            form.setProp('params.value_field', 'value');
                            form.setProp('params.device_as_id', 1);
                            form.setProp('params.value_as_id', 1);
                            break;
                    }
                } },
                user: { name: 'Username', type: 'string' },
                pass: { name: 'Password', type: 'string' },
                lwt_topic: { name: 'LWT Topic', type: 'string' },
                lwt_msg: { name: 'LWT Message', type: 'string' },
                subscribe_topic: { name: 'Subscribe Topic', type: 'string', onChange: (e, form, id, prop, val, config) => {
                    if (val.includes('%device_id%')) {
                        form.props.config.groups.params.configs.subscribe_data_device_id.if = true;
                        form.setProp('params.device_as_id', 0);
                        form.forceUpdate();
                    }
                    if (val.includes('%device_name%')) {
                        form.setProp('params.device_as_id', 1);
                        form.props.config.groups.params.configs.subscribe_data_device_id.if = true;
                        form.forceUpdate();
                    }
                    if (val.includes('%value_id%')) {
                        form.setProp('params.value_as_id', 0);
                        form.props.config.groups.params.configs.subscribe_data_value_id.if = true;
                        form.forceUpdate();
                    }
                    if (val.includes('%value_name%')) {
                        form.setProp('params.value_as_id', 1);
                        form.props.config.groups.params.configs.subscribe_data_value_id.if = true;
                        form.forceUpdate();
                    }
                    if (val.includes('%value%')) {
                        form.props.config.groups.params.configs.subscribe_data_value.if = true;
                        form.forceUpdate();
                    }
                } },
                device_as_id: { name: 'Device Identifier', type: 'select', options: [{ name: 'id', value: 0 }, { name: 'name', value: 1 }]},
                subscribe_data_device_id: { name: 'Device Identifier Field', type: 'string' },
                value_as_id: { name: 'Value Identifier', type: 'select', options: [{ name: 'id', value: 0 }, { name: 'name', value: 1 }]},
                subscribe_data_value_id: { name: 'Value Identifier Field', type: 'string' },
                subscribe_data_value: { name: 'Value Field', type: 'string' },
                publish_topic: { name: 'Publish Topic', type: 'string' },
                publish_data: { name: 'Publish Data', type: 'string' },
                ad_topic: { name: 'AutoDiscover Topic', type: 'string' },
                ad_data: { name: 'AutoDiscover Data', type: 'string' },
            }
        };
    }

    defaults = () => ({
        'params.uri': 'mqtt://iot.eclipse.org',
        'params.type': 0
    });
}

export const mqtt = new MQTT();