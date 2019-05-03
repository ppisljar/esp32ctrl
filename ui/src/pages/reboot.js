import { h, Component } from 'preact';
import { loader } from '../lib/loader';
import { settings } from '../lib/settings';


export class RebootPage extends Component {
    render(props) {
        return (
            <div>ESPEasy is rebooting ... please wait a while, this page will auto refresh.</div>
        );
    }

    componentDidMount() {
        loader.show();
        fetch('/reboot').then(() => {
            setTimeout(() => {
                const name = settings.get('unit.name');
                loader.hide();
                window.location.href = `http://${name}.local`;
            }, window.location.href.includes('local') ? 2000: 10000)
        })
    }
}