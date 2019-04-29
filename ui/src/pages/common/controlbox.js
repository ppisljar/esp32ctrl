import { h, Component } from 'preact';
import { Form } from '../../components/form';

export class Controlbox extends Component {
    render(props) {
        const widget = props.item && this.props.nodes.find(w => w.name == props.item.name);

        if (widget && widget.getEditorComponent) {
            const EditorComponent = widget.getEditorComponent();
            return (<div style={this.props.style}><EditorComponent item={props.item} /></div>);
        } else if (widget && widget.getEditorConfig) {
            return (<div style={this.props.style}><Form config={widget.getEditorConfig()} selected={props.item} /></div>);
        }
        return (null);
    }
}

