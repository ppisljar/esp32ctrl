import { h, Component } from 'preact';
import { DragDropContext } from 'preact-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Page } from './page';


export class FlowEditorComponent extends Component {
    render(props) {
        return (
            <Page devices={this.props.devices} rules={this.props.rules} />
        );
    }
}

export const FlowEditor = DragDropContext(HTML5Backend)(FlowEditorComponent);

