import { h, Component } from 'preact';
import { settings } from '../lib/settings';
import { loadDevices } from '../lib/espeasy';

export class DashboardPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            devices: settings.get('plugins').filter(p => p.enabled),
            deviceState: [],
        }

        this.renderSwitch = (device, deviceState) => {
            const state = deviceState[device.state.values[0].name];
            return (
                <div className='device'>
                    <div class="icon">
                        <span class={device.icon} />
                    </div>
                    <div class="body">
                        <div class='info'>
                            {device.name}<span><button>{state ? 'ON' : 'OFF'}</button></span>
                        </div>
                    </div>
                </div>
            );
        };
// TODO: we should have a generic way to access device values
        this.renderSensor = (device, deviceState) => {
            return (
                <div className='device'>
                    <div class="icon">
                        <span class={device.icon} />
                    </div>
                    <div class="body">
                        <div class='info'>
                            {device.name}
                            <span>
                                
                            {device.state && device.state.values.map((value, i) => {
                                return (<div>{value.name}: {deviceState[value.name]} </div>);
                            })}
                            </span>
                        </div>
                    </div>
                </div>
            );
        };

        this.renderRegulator = (device, deviceState) => {
            return (
            <div className='device'>
                <div class="icon">
                    <span class={device.icon} />
                </div>
                <div class="body">
                    <div class='info'>
                    {device.name}<span><input width='200px' type='range' value={device.params.level} /></span>
                    </div>
                </div>
            </div>);
        };

        this.renderDevice = (device, deviceState) => {
            switch (device.type) {
                case 1: return this.renderSwitch(device, deviceState);
                case 2: case 3: case 4: case 6: case 12:
                        return this.renderSensor(device, deviceState);
                case 5: return this.renderRegulator(device, deviceState);
                
                default:
                    return (null);
            }
        };
    }

    render(props) {
        return (
            <div>
                {this.state.devices.map((device, i) => {
                    return this.renderDevice(device, this.state.deviceState[i] || {});
                })}
            </div>
        );
    }

    fetchDevices() {
        loadDevices().then(deviceState => {
            this.setState({ deviceState });
            if (!this.shutdown)
                setTimeout(() => {
                    this.fetchDevices();
                }, 1000);
        });
        
    }

    componentDidMount() {
        this.fetchDevices();
    }

    componentWillUnmount() {
        this.shutdown = true;
    }
}