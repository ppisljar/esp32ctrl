import { h, Component } from 'preact';
import { settings } from '../lib/settings';

export class ConfigPluginsPage extends Component {
    constructor(props) {
        super(props);

        this.plugins = settings.get('ui_plugins');
        if (!this.plugins) {
            this.plugins = [
                { name: 'IconSelector', enabled: false, url: 'http://localhost:8080/build/iconpicker.js' },
            ];
            settings.set('ui_plugins', this.plugins);
        }

        this.handleEnableToggle = (e) => {
            settings.set(e.currentTarget.dataset.prop, e.currentTarget.checked ? 1 : 0);
        }

        this.addDevice = () => {
            const newPlugin = { id: firstFreeKey(plugins), idx: firstFreeKey(plugins, 'idx'), type: 0, name: 'new device', enabled: false, params: {}};
            this.plugins.push(newPlugin);
            this.forceUpdate();
        }

        this.deleteDevice = (i) => {
            this.plugins.splice(i, 1);
            this.forceUpdate();
        }
    }
    render(props) {
        return (
            <div>
                {/* <div><button type="button" onClick={this.addDevice}>add device</button></div> */}
            {this.plugins.map((p, i) => {
                if (p === null) return (null);
                const enabledProp = `ui_plugins[${i}].enabled`;
                return (
                    <div class="device">
                        <div class="body">
                            <div class="info">
                                {i+1}: <input type="checkbox" defaultChecked={p.enabled} data-prop={enabledProp} onChange={this.handleEnableToggle}></input>
                                &nbsp;&nbsp;{p.name} [{p.url}]
                                {/* <a href={editUrl}>edit</a>
                                <a onClick={() => {this.deleteDevice(i);}}>delete</a>
                                <a onClick={() => {this.moveDevice(i, 'up');}}>up</a>
                                <a onClick={() => {this.moveDevice(i, 'down');}}>down</a> */}
                            </div>
                        </div>
                    </div>
                    )
            })}
            </div>
        );
    }
}