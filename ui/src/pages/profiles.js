import { h, Component } from 'preact';
import { settings } from '../lib/settings';

const firstFreeKey = (array, key = 'id') => {
    let i = 0;
    while(array.find(e => e && e[key] == i)) i++;
    return i;
}

export class ProfilesPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            config: settings.get('profiles'),
        }

        if (!this.state.config) {
            this.state.config = [];
            settings.set('profiles', this.state.config);
        }

        this.add = () => {
            const item = { id: firstFreeKey(this.state.config), name: 'new profile', steps: []};
            this.state.config.push(item);
            window.location.hash = `#profiles/edit/${this.state.config.length - 1}`;
        }

        this.delete = (i) => {
            this.state.config.splice(i, 1);
            this.forceUpdate();
        }
    }
    render(props) {
        return (
            <div>
                <div><button type="button" onClick={this.add}>add profile</button></div>
                {this.state.config.map((item, i) => {
                    const editUrl = `#profiles/edit/${i}`;
                    const iconClass = `${item.icon}`;
                    return (
                        <div class="device">
                            <div class="icon">
                                <span class={iconClass} />
                            </div>
                            <div class="body">
                                <div class="info">
                                    {i+1}: &nbsp;&nbsp;{item.name} [{item.description}]
                                    <a href={editUrl}>edit</a>
                                    <a onClick={() => {this.delete(i);}}>delete</a>
                                </div>
                            </div>
                        </div>
                        )
                })}
            </div>
        );
    }
}