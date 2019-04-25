import {Device} from './_defs';

class UdpServer extends Device {
    constructor() {
        super();
        this.vals = 0;
    }

    getValueProps = (vals) => {
        const result = {};
        vals.forEach((val, i) => {
            if (!val) return;
            result['output_' + i] = [
                { name: `Var ${i}`, type: 'select', options: [{ name: 'Byte', value: 1 }, { name: 'Int16', value: 2 }], var: `params.packet[${i}]` },
                { name: 'Name', type: 'string', var: `state.values[${i}].name` }, 
                { type: 'button', value: 'X', click: (event, form) => {
                    const conf = form.props.selected;
                    conf.params.packet.splice(i, 1);
                    conf.state.values.splice(i, 1);
                    this.vals--;
                    const { params, packet } = this.getFields(conf);
                    form.props.config.groups.params = params;
                    form.props.config.groups.packet = packet;

                    form.forceUpdate();
                }}
            ];
        });
        return result;
    }

    getFields = (conf) => {
        const packet = conf.params ? conf.params.packet || [] : [];
        return {
            params: {
                name: 'Config',
                configs: {
                    port: { name: 'Port', type: 'number' },
                }
            },
            packet: {
                name: 'Packet',
                configs: {
                    ...this.getValueProps(packet),
                    add: { value: 'Add Variable', type: 'button', click: (event, form) => {
                        conf.params.packet.push(1);
                        conf.state.values.push({ name: `Var${conf.state.values.length + 1}`})
                        const { params, packet } = this.getFields(conf);
                        form.props.config.groups.params = params;
                        form.props.config.groups.packet = packet;
                        this.vals++;
                        form.forceUpdate();
                    }}
                }
            }
        }
    }

    defaults = () => ({
        'params.packet[0]': 1,
        'params.port': 5000,
        'state.values[0].name': 'Var1',
    });
}

export const udp_server = new UdpServer();