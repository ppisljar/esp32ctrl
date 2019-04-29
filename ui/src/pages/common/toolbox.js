import { h, Component } from 'preact';
import { ToolboxItem } from './toolbox_item';

export class Toolbox extends Component {
    constructor(props) {
        super(props);
    }

    render(props) {
        return (
            <div style={this.props.style}>
                {this.props.nodes.map(widget => {
                    return (<ToolboxItem itemStyle={this.props.itemStyle} widget={widget} />);
                })}
            </div>
        );
    }
}

