import { h, Component } from 'preact';
import { settings } from '../lib/settings';
import { devices } from '../devices';
import { loadDevices } from '../lib/espeasy';

export class DevicesPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            devices: [],
        }

        this.handleEnableToggle = (e) => {
            settings.set(e.currentTarget.dataset.prop, e.currentTarget.checked ? 1 : 0);
        }

        this.addDevice = () => {
            const plugins = settings.settings.plugins;
            plugins.push({ type: 0, name: 'new device', enabled: false, params: {}});
            window.location.hash = `#devices/edit/${plugins.length - 1}`;
        }
    }
    render(props) {
        const tasks = settings.get('plugins');
        if (!tasks) return;
        return (
            <div>
                <div><button type="button" onClick={this.addDevice}>add device</button></div>
            {tasks.map((task, i) => {
                const editUrl = `#devices/edit/${i}`;
                const device = devices.find(d => d.value === task.type);
                const deviceType = device ? device.name : '--unknown--';
                const enabledProp = `plugins[${i}].enabled`;
                const deviceLive = this.state.devices[i];
                const vals = deviceLive ? Object.keys(deviceLive).map(key => ({ name: key, value: deviceLive[key]})) : [];
                vals.forEach(v => {
                    if (v.value === true) v.value = 1;
                    if (v.value === false) v.value = 0;
                });
                return (
                    <div class="device">
                        <div class="info">
                             {i+1}: <input type="checkbox" defaultChecked={task.enabled} data-prop={enabledProp} onChange={this.handleEnableToggle}></input>
                             &nbsp;&nbsp;{task.name} [{deviceType}]
                            <a href={editUrl}>edit</a>
                        </div>
                        <div class="vars">
                         {vals.map(v => {
                                return (<span>{v.name}: {v.value} </span>);
                            })}
                        </div>
                    </div>
                    )
            })}
            </div>
        );
    }

    fetchDevices() {
        loadDevices().then(devices => {
            this.setState({ devices });
            if (!this.shutdown)
                setTimeout(() => {
                    this.fetchDevices();
                }, 1000);
        });
        
    }

    componentDidMount() {
        this.fetchDevices();
    }

    componentWillMount() {
        this.shutdown = true;
    }
}