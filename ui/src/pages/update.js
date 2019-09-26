import { h, Component } from 'preact';
import { fetchProgress } from '../lib/esp';
import { loader } from '../lib/loader';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

export class UpdatePage extends Component {
    constructor(props) {
        super(props);

        this.state = { progress: 0 }

        this.saveForm = () => {
            loader.show();
    
            // POST to /update will boot ESP in OTA mode
            fetch('/update', {
                method: 'POST',
            }).then(async () => { 
                // wait for ESP to come back online
                while (true) {
                    try {
                        await fetch('/');
                        break;
                    } catch (e) {
                        console.log('still waiting');
                        await sleep(1000);
                    }
                }
                console.log('got it!');
                // post the new firmare
                fetchProgress('/update', {
                    method: 'POST',
                    body: this.file.files[0],
                    onProgress: (e) => {
                        const perc = 100 * e.loaded / e.total;
                        this.setState({ progress: perc });
                    }
                }).then(() => {
                    window.location.href = '#config/reboot';
                });
            });
        }
    }

    render(props) {
        return (
        <form class="pure-form pure-form-aligned">
            <div class="pure-control-group">
                <a href="https://github.com/ppisljar/esp32ctrl/">download latest version</a>
                current version: <span>v</span>
                <label for="file" class="pure-checkbox">
                    Firmware:
                </label>
                <input id="file" type="file" ref={ref => this.file = ref} />
                <button type="button" onClick={this.saveForm}>upload</button>
                { (this.state.progress) ? (<span> {Math.round(this.state.progress)}%</span>) : (null) }
            </div>
        </form>
        )
    }
}