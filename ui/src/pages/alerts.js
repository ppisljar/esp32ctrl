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

export class AlertsPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            config: settings.get('alerting'),
        }

        if (!this.state.config) {
            this.state.config = { alerts: [], enabled: false };
            settings.set('alerting', this.state.config);
        }

        this.handleEnableToggle = (e) => {
            settings.set(e.currentTarget.dataset.prop, e.currentTarget.checked ? 1 : 0);
        }

        this.addAlert = () => {
            const newAlert = { id: firstFreeKey(this.state.config.alerts), priority: 255, name: 'new alert', enabled: false, params: {}, triggers: []};
            this.state.config.alerts.push(newAlert);
            window.location.hash = `#alerts/edit/${this.state.config.alerts.length - 1}`;
        }

        this.deleteAlert = (i) => {
            this.state.config.alerts.splice(i, 1);
            this.forceUpdate();
        }
    }
    render(props) {
        return (
            <div>
                <div><button type="button" onClick={this.addAlert}>add alert</button></div>
                {this.state.config.alerts.map((alert, i) => {
                    const editUrl = `#alerts/edit/${i}`;
                    const enabledProp = `alerting.alerts[${i}].enabled`;
                    const iconClass = `${alert.icon}`;
                    return (
                        <div class="device">
                            <div class="icon">
                                <span class={iconClass} />
                            </div>
                            <div class="body">
                                <div class="info">
                                    {i+1}: <input type="checkbox" defaultChecked={alert.enabled} data-prop={enabledProp} onChange={this.handleEnableToggle}></input>
                                    &nbsp;&nbsp;{alert.name} [{alert.description}]
                                    <a href={editUrl}>edit</a>
                                    <a onClick={() => {this.deleteAlert(i);}}>delete</a>
                                </div>
                            </div>
                        </div>
                        )
                })}
            </div>
        );
    }
}