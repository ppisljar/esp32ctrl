import { h, Component } from 'preact';
import { widgets } from './widgets';
import { Form } from '../../components/form';

const style = {
    position: 'relative',
    border: '1px solid gray',
    padding: '20px',
    left: '-350px',
    width: '300px',
};

export class Controlbox extends Component {
    constructor(props) {
        super(props);
        
    }

    render(props) {
        const widget = props.item && widgets.find(w => w.name == props.item.name);

        if (widget && widget.editorComponent) {
            return (<div style={style}><widget.editorComponent item={props.item} /></div>);
        } else if (widget && widget.editorConfig) {
            return (<div style={style}><Form config={widget.editorConfig} selected={props.item} /></div>);
        }
        return (null);
    }
}

