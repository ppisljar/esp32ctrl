import { h, Component } from 'preact';
import { Form } from '../components/form';
import { settings } from '../lib/settings';

const logLevelOptions = [
    { name: 'None', value: 0 },
    { name: 'Error', value: 1 },
    { name: 'Info', value: 2 },
    { name: 'Debug', value: 3 },
    { name: 'Debug More', value: 4 },
    { name: 'Debug Dev', value: 9 },
];

const formConfig = {
    onSave: (vals) => { console.log(vals); },
    groups: {
        ntp: {
            name: 'NTP Settings',
            configs: {
                enabled: { name: 'Use NTP', type: 'checkbox' },
                host: { name: 'NTP Hostname', type: 'string' },
            }
        },
        location: {
            name: 'Location Settings',
            configs: {
                long: { name: 'Longitude', type: 'number' },
                lat: { name: 'Latitude', type: 'number' },
            }
        },
        log: {
            name: 'Log Settings',
            configs: {
                syslog_ip: { name: 'Syslog IP', type: 'ip' },
                syslog_level: { name: 'Syslog Level', type: 'select', options: logLevelOptions },
                syslog_facility: { name: 'Syslog Level', type: 'select', options: [
                    { name: 'Kernel', value: 0 },
                    { name: 'User', value: 1 },
                    { name: 'Daemon', value: 3 },
                    { name: 'Message', value: 5 },
                    { name: 'Local0', value: 16 },
                    { name: 'Local1', value: 17 },
                    { name: 'Local2', value: 18 },
                    { name: 'Local3', value: 19 },
                    { name: 'Local4', value: 20 },
                    { name: 'Local5', value: 21 },
                    { name: 'Local6', value: 22 },
                    { name: 'Local7', value: 23 },
                ] },
                serial_level: { name: 'Serial Level', type: 'select', options: logLevelOptions },
                web_level: { name: 'Web Level', type: 'select', options: logLevelOptions },
            }
        },
    },
}

export class ConfigAdvancedPage extends Component {
    render(props) {
        return (
            <Form config={formConfig} selected={settings.get()} />
        );
    }
}