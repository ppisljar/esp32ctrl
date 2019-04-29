import { h, Component } from 'preact';

export class WidgetInput extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const id = `node-${this.props.node.id}-i-0`;
        return (
            <div id={id} className="node-input" />
        )
    }
}