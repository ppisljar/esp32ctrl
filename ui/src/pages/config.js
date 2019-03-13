import { h, Component } from 'preact';
import { Form } from '../components/form';
import { settings } from '../lib/settings';

const ipBlockLevel = [
    { name: 'Allow All', value: 0 },
    { name: 'Allow Local Subnet', value: 1 },
    { name: 'Allow IP Range', value: 2 },
]

const formConfig = {
    groups: {
        unit: {
            name: 'General',
            configs: {
                name: { name: 'Unit Name', type: 'string' },
                nr: { name: 'Unit Number', type: 'number' },
                appendToHost: { name: 'Append Unit Name to Hostname', type: 'checkbox' },
                view_password: { name: 'View Password', type: 'string', var: 'security.viewpass'},
                edit_password: { name: 'User Password', type: 'string', var: 'security.userpass'},
                admin_password: { name: 'Admin Password', type: 'string', var: 'security.pass'},
            }
        },
        wifi: {
            name: 'WiFi',
            configs: {
                ssid: { name: 'SSID', type: 'string' },
                pass: { name: 'Password', type: 'password' },
                ssid2: { name: 'Fallback SSID', type: 'string' },
                pass2: { name: 'Fallback Password', type: 'password' },
                wpaapmode: { name: 'WPA AP Mode Key:', type: 'string' },
            }
        },
        clientIP: {
            name: 'Client IP Filtering',
            configs: {
                blocklevel: { name: 'IP Block Level', type: 'select', options: ipBlockLevel, var: 'security.ip_block.enabled' },
                lowerrange: { name: 'Access IP lower range', type: 'ip', var: 'security.ip_block.start' },
                upperrange: { name: 'Access IP upper range', type: 'ip', var: 'security.ip_block.end' },
            }
        },
        ip: {
            name: 'IP Settings',
            configs: {
                enabled: { name: 'Static IP', type: 'checkbox', var: 'wifi.static_ip.enabled'},
                ip: { name: 'IP', type: 'ip', var: 'wifi.static_ip.ip' },
                gw: { name: 'Gateway', type: 'ip', var: 'wifi.static_ip.gw' },
                netmask: { name: 'Subnet', type: 'ip', var: 'wifi.static_ip.netmask' },
                dns: { name: 'DNS', type: 'ip', var: 'wifi.static_ip.dns' },
            }
        },
        // sleep: {
        //     name: 'Sleep Mode',
        //     configs: {
        //         awaketime: { name: 'Sleep awake time', type: 'number' },
        //         sleeptime: { name: 'Sleep time', type: 'number' },
        //         sleeponfailiure: { name: 'Sleep on connection failure', type: 'checkbox' },
        //     }
        // }
    },
}

export class ConfigPage extends Component {
    render(props) {
        formConfig.onSave = (values) => {
            settings.set(`config`, values);
            window.location.href='#devices';
        }
        const config = settings.get();
        return (
            <Form config={formConfig} selected={config} />
        );
    }
}