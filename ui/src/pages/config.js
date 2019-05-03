import { h, Component } from 'preact';
import { Form } from '../components/form';
import { settings } from '../lib/settings';

const ipBlockLevel = [
    { name: 'Allow All', value: 0 },
    { name: 'Allow Local Subnet', value: 1 },
    { name: 'Allow IP Range', value: 2 },
]

let ssids = ['loading...'];

const getFormConfig = (config, form) => {
    const wifiScan = () => {
        fetch('/wifi_scan').then(r => r.json()).then(r => {
            ssids = r;
            form.forceUpdate();
        });
    }
    return {
        groups: {
            unit: {
                name: 'General',
                configs: {
                    name: { name: 'Unit Name', type: 'string' },
                    // nr: { name: 'Unit Number', type: 'number' },
                    // appendToHost: { name: 'Append Unit Name to Hostname', type: 'checkbox' },
                    view_password: { name: 'View Password', type: 'string', var: 'security.viewpass'},
                    edit_password: { name: 'User Password', type: 'string', var: 'security.userpass'},
                    admin_password: { name: 'Admin Password', type: 'string', var: 'security.pass'},
                }
            },
            wifi: {
                name: 'WiFi',
                configs: {
                    ssid: [
                        { name: 'SSID', type: ssids.length ? 'select' : 'string', options: ssids, var: 'wifi.ssid' },
                        { name: '', type: 'button', value: 'scan', click: wifiScan },
                    ],
                    pass: { name: 'Password', type: 'password' },
                    ssid2: { name: 'Fallback SSID', type: 'string' },
                    pass2: { name: 'Fallback Password', type: 'password' },
                    wpaapmode: { name: 'WPA AP Mode Key:', type: 'string' },
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
            clientIP: {
                name: 'Client IP Filtering',
                configs: {
                    blocklevel: { name: 'IP Block Level', type: 'select', options: ipBlockLevel, var: 'security.ip_block.enabled' },
                    lowerrange: { name: 'Access IP lower range', type: 'ip', var: 'security.ip_block.start' },
                    upperrange: { name: 'Access IP upper range', type: 'ip', var: 'security.ip_block.end' },
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
}

export class ConfigPage extends Component {
    constructor(props) {
        super(props);

        fetch('/wifi_scan').then(r => r.json()).then(r => {
            ssids = r;
            this.forceUpdate();
        });
    }
    render(props) {
       
        const config = settings.get();
        const formConfig = getFormConfig(config, this);

        return (
            <Form config={formConfig} selected={config} />
        );
    }
}