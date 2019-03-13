import { h, Component } from 'preact';

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
        return (
            <div>
                <div style="width: 100%; height: 200px; overflow-y: scroll;" ref={ref => this.log = ref}>loading logs ...</div>
                <div>Command: <input type="text" ref={ref => this.cmd = ref}/><button type="button" onClick={this.sendCommand}>send</button></div>
                <textarea style="width: 100%; height: 200px" ref={ref => this.cmdOutput = ref}></textarea>
            </div>
        );
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            this.fetch();
        }, 1000);
    }

    componentWillUnmount() {
        if (this.interval) clearInterval(this.interval);
    }
}