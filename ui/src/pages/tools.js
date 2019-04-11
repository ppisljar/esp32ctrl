import { h, Component } from 'preact';
import { settings } from '../lib/settings';
import { getEvents, loadDevices } from '../lib/espeasy';

const CMD = {
  SET     : 0xf0,
  SET_CFG : 0xf1,
  EVENT   : 0xf2,
  TIMER   : 0xf3,
  DELAY   : 0xf4,
  RESET   : 0xf5,
  GPIO    : 0xf6,
  GET     : 0xf7,
  GET_CFG : 0xf8,
  VAR     : 0xf9,
  SEND    : 0xfa,
  X8      : 0xfb,
  IF      : 0xfc,
  ELSE    : 0xfd,
  ENDIF   : 0xfe,
  ENDON   : 0xff,
}

export class ToolsPage extends Component {
    constructor(props) {
        super(props);

        this.history = '';

        this.events = {};

        this.state = {
            cmd: 242,
            event: null,
            device: null,
            state: null,
            value: 0,
        }

        this.sendCommand = (e) => {
            const cmdParts = this.cmd.value.split(',');
            const cmdArray = [];
            const cmd = CMD[cmdParts[0].toUpperCase()];
            if (!cmd) return;
            
            cmdParts.forEach((part, i) => {
                if (i === 0) {
                    cmdArray.push(cmd);
                    return;
                }
                const val = parseInt(part);
                cmdArray.push(val);
            });

            fetch(`/cmd/3`, {
                method: 'POST',
                body: new Uint8Array(cmdArray),
            }).then(response => response.text()).then(response => {
                this.cmdOutput.value = response;
            });
        }

        this.sendCommand2 = () => {
            const cmdArray = [];
            
            cmdArray.push(this.state.cmd);
            if (this.state.cmd === 242) { // event
                cmdArray.push(this.state.event);
            } else {
                cmdArray.push(this.state.device);
                cmdArray.push(this.state.state);
                if (this.state.cmd === 240)
                    cmdArray.push(1);
                    cmdArray.push(this.state.val);
            }

            fetch(`/cmd/3`, {
                method: 'POST',
                body: new Uint8Array(cmdArray),
            }).then(response => response.text()).then(response => {
                this.cmdOutput.value = response;
            });
        }
    }

    fetch() {
        fetch('/logs').then(response => response.text()).then(response => {
            response.split('\n').map(log => {
                if (log.trim() === '') return;
                this.history += `<div class="log_level"><span class="date"></span><span class="value">${log}</span></div>`;
                this.log.innerHTML = this.history;
                if (true) {
                    this.log.scrollTop = this.log.scrollHeight;
                }
            })
        });
    }

    render(props) {
        const devices = settings.get('plugins');
        
        const setCmd = e => {
            this.setState({ cmd: parseInt(e.currentTarget.value) });
        }
        const setEvent = e => {
            this.setState({ event: parseInt(e.currentTarget.value) });
        }
        const setDevice = e => {
            this.setState({ device: parseInt(e.currentTarget.value) });
        }
        const setDeviceState = e => {
            this.setState({ state: e.currentTarget.value });
        }
        const setDeviceStateVal = e => {
            this.setState({ val: e.currentTarget.value });
        }

        const device_state = this.state.device !== null ? this.device_state[this.state.device] || {} : {};

        return (
            <div>
                <div style="width: 100%; height: 200px; overflow-y: scroll;" ref={ref => this.log = ref}>loading logs ...</div>
                <div>Command: <input type="text" ref={ref => this.cmd = ref}/><button type="button" onClick={this.sendCommand}>send</button></div>
                <div>
                    Command: 
                    <select onChange={setCmd}>
                        <option value='242'>event</option>
                        <option value='240'>set state</option>
                    </select>

                    {this.state.cmd === 242 &&
                    <select onChange={setEvent}>
                        {Object.keys(this.events).map((key) => { 
                            const i = this.events[key];
                            return (<option value={i}>{key}</option>);
                        })}
                    </select>}

                    {this.state.cmd !== 242 && 
                    <select onChange={setDevice}>
                        {devices.map((device, i) => { 
                            return (<option value={i}>{device.name}</option>);
                        })}
                    </select>}

                    {this.state.cmd !== 242 && 
                    <select onChange={setDeviceState}>
                        {
                            Object.keys(device_state).map((state, i) => { 
                                return (<option value={i}>{state}</option>);
                            })
                        }
                    </select>}

                    {this.state.cmd !== 242 && 
                    <input type='text' onChange={setDeviceStateVal}></input>
                    } 

                    <button type="button" onClick={this.sendCommand2}>send</button>                  
                </div>
                <textarea style="width: 100%; height: 200px" ref={ref => this.cmdOutput = ref}></textarea>
            </div>
        );
    }

    async componentDidMount() {
        this.device_state = await loadDevices();
        this.events = await getEvents();
        this.forceUpdate();
        this.interval = setInterval(() => {
            this.fetch();
        }, 1000);
    }

    componentWillUnmount() {
        if (this.interval) clearInterval(this.interval);
    }
}