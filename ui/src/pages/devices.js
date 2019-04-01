import { h, Component } from 'preact';
import { settings } from '../lib/settings';
import { devices } from '../devices';
import { loadDevices } from '../lib/espeasy';
import { ICON_CLASS } from 'mini-toastr';

const user = "admin";

const firstFreeKey = (array, key = 'id') => {
    let i = 0;
    while(array.find(e => e && e[key] == i)) i++;
    return i;
}  

const ruleUsesDevice = (rule, deviceId) => {
    return (rule.t === 'if/else' && rule.v[0].split('-')[0] == deviceId) ||
    (rule.t === 'set state' && rule.v[0].split('-')[0] == deviceId) ||
    (rule.t === 'get state' && rule.v[0].split('-')[0] == deviceId);
}

const findRulesUsingDevice = (rules, deviceId, arr = []) => {
    rules.forEach(rule => {
        if (ruleUsesDevice(rule, deviceId)){
            arr.push(rule);
        }
        rule.o.forEach(o => {
            //o.forEach(outRule => {
                findRulesUsingDevice(o, deviceId, arr);
            //});
        });
    });
    return arr;
}

const deleteRulesUsingDevice = (rules, deviceId) => {
    for( var i = rules.length-1; i>=0; i--){
        if (ruleUsesDevice(rules[i], deviceId)) rules.splice(i, 1);
    }
    rules.forEach((rule, i) => {
        rule.o.forEach(o => {
            //o.forEach(outRule => {
                deleteRulesUsingDevice(o, deviceId);
            //});
        });
    });
}

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
            const empty = conf.state.values.findIndex(e => e === null);
            const newPlugin = { id: firstFreeKey(plugins), idx: firstFreeKey(plugins, 'idx'), type: 0, name: 'new device', enabled: false, params: {}};
            if (empty !== -1) plugins[empty] = newPlugin;
            else plugins.push(newPlugin);
            window.location.hash = `#devices/edit/${empty === -1 ? plugins.length - 1 : empty}`;
        }

        this.deleteDevice = (i) => {
            const elementsUsingDevice = findRulesUsingDevice(settings.rules, i);
            let shouldDelete = false;
            if (elementsUsingDevice.length) {
                shouldDelete = confirm("The device you are trying to delete is used in Automation. Deleting it will remove all automation nodes refering to it.\nAre you sure you want to continue ?");
            } else {
                shouldDelete = confirm("Are you sure you want to delete the plugin ?");
            }
            if (shouldDelete) {
                deleteRulesUsingDevice(settings.rules, i);
                settings.settings.plugins[i] = null;
                this.forceUpdate();
            }
        }
    }
    render(props) {
        let tasks = settings.get('plugins');
        if (!tasks) return;
        return (
            <div>
                <div><button type="button" onClick={this.addDevice}>add device</button></div>
            {tasks.map((task, i) => {
                if (task === null) return (null);
                if (settings.userName !== 'admin' && task.lock) return (null);
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
                const iconClass = `${task.icon}`;
                return (
                    <div class="device">
                        <div class="icon">
                            <span class={iconClass} />
                        </div>
                        <div class="body">
                            <div class="info">
                                {i+1}: <input type="checkbox" defaultChecked={task.enabled} data-prop={enabledProp} onChange={this.handleEnableToggle}></input>
                                &nbsp;&nbsp;{task.name} [{deviceType}]
                                <a href={editUrl}>edit</a>
                                <a onClick={() => {this.deleteDevice(i);}}>delete</a>
                            </div>
                            <div class="vars">
                            {vals.map(v => {
                                    return (<span>{v.name}: {v.value} </span>);
                                })}
                            </div>
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