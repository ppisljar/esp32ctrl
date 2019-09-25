import { h, Component } from 'preact';
import { settings } from '../lib/settings';
import { loadDevices } from '../lib/esp';
import { toByteArray } from './floweditor/nodes/helper';
import { AnsiUp } from '../3rd/ansi_up';

const ansi = new AnsiUp();

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
            logs: [],
            tag: '',
            level: 0,
            log_filter: /.*/
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
                const event = toByteArray(this.state.event, 2);
                cmdArray.push(event[1]);
                cmdArray.push(event[0]);
                cmdArray.push(0);
            } else {
                cmdArray.push(this.state.device);
                cmdArray.push(this.state.state);
                if (this.state.cmd === 240)
                    cmdArray.push(1);
                    cmdArray.push(this.state.val);
            }

            fetch(`/cmd`, {
                method: 'POST',
                body: new Uint8Array(cmdArray),
            }).then(response => response.text()).then(response => {
                this.cmdOutput.value = response;
            });
        }

        this.evtSource = new EventSource('/logs');

        this.evtSource.onmessage = (e) => {
            this.state.logs.push(e.data);
            this.forceUpdate();
        }
    }

    // fetch() {
    //     fetch('/logs').then(response => response.text()).then(response => {
    //         response.split('\n').map(log => {
    //             if (log.trim() === '') return;
    //             let formatted = log.trim().substr(4);
    //             formatted = formatted.substr(0, formatted.length - 4);
    //             const cls = formatted.substr(0, 3);
    //             formatted = formatted.substr(3);
    //             this.history += `<div class="log_level c${cls}"><span class="date"></span><span class="value">${formatted}</span></div>`;
    //             this.log.innerHTML = this.history;
    //             if (true) {
    //                 this.log.scrollTop = this.log.scrollHeight;
    //             }
    //         })
    //     });
    // }

    render(props) {
        const devices = settings.get('plugins');
        
        const setCmd = e => {
            this.setState({ cmd: parseInt(e.currentTarget.value), event: null, device: null, state: null });
        }
        const setEvent = e => {
            this.setState({ event: parseInt(e.currentTarget.value) });
        }
        const setDevice = e => {
            this.setState({ device: parseInt(e.currentTarget.value), state: null });
        }
        const setDeviceState = e => {
            this.setState({ state: e.currentTarget.value });
        }
        const setDeviceStateVal = e => {
            this.setState({ val: e.currentTarget.value });
        }
        const setTag = e => {
            this.setState({ tag: e.currentTarget.value });
        }
        const setLevel = e => {
            this.setState({ level: e.currentTarget.value });
        }
        const setLogFilter = e => {
            this.setState({ log_filter: /e.currentTarget.value/ });
        }
        

        const setLoggingLevel = e => {
            fetch(`/logs/${this.state.tag}/${this.state.level}`, {
                method: 'POST',
            });
        }

        const device_state = this.state.device !== null ? this.device_state[this.state.device] || {} : {};

        return (
            <div>
                <div>
                    TAG: 
                    <input type='text' value={this.state.tag} onChange={setTag}></input>

                    LEVEL: 
                    <select value={this.state.level} onChange={setLevel}>
                        <option value='0'>none</option>
                        <option value='1'>error</option>
                        <option value='2'>warning</option>
                        <option value='3'>info</option>
                        <option value='4'>debug</option>
                        <option value='5'>verbose</option>
                    </select>

                    <button type="button" onClick={setLoggingLevel}>SET</button>   

                    FILTER (regex): 
                    <input type='text' value={this.state.log_filter.toString()} onChange={setLogFilter}></input>
                </div>
                <div style="width: 100%; height: 200px; overflow-y: scroll; border: 1px solid gray; margin-bottom: 10px;">
                    {this.state.logs.filter(log => {
                        if (this.state.log_filter && !this.state.log_filter.test(log)) return false;
                        return true;
                    }).map(log => {
                        const decorated = ansi.ansi_to_html(log);
                        return (<div dangerouslySetInnerHTML={{__html: decorated}}></div>);
                    })}
                </div>
                <div>
                    Command: 
                    <select value={this.state.cmd} onChange={setCmd}>
                        <option value='242'>event</option>
                        <option value='240'>set state</option>
                    </select>

                    {this.state.cmd === 242 &&
                    <select value={this.state.event} onChange={setEvent}>
                        
                        {Object.keys(this.events).map((key) => { 
                            const i = this.events[key];
                            return (<option value={i}>{key}</option>);
                        })}
                    </select>}

                    {this.state.cmd !== 242 && 
                    <select value={this.state.device} onChange={setDevice}>
                        
                        {devices.map((device, i) => { 
                            return (<option value={i}>{device.name}</option>);
                        })}
                    </select>}

                    {this.state.cmd !== 242 && 
                    <select value={this.state.state} onChange={setDeviceState}>
                        
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
                <textarea readonly style="width: 100%; height: 200px" ref={ref => this.cmdOutput = ref}></textarea>
            </div>
        );
    }

    async componentDidMount() {
        this.device_state = await loadDevices();
        this.events = settings.events;
        //this.forceUpdate();
    }

    componentWillUnmount() {
        if (this.evtSource) {
            this.evtSource.close();
        }
    }
}