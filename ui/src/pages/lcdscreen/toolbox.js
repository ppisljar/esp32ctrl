import { h, Component } from 'preact';
import { getWidgets } from './widgets';
import { ToolboxItem } from './toolbox_item';
import { settings } from '../../lib/settings';

export class Toolbox extends Component {
    constructor(props) {
        super(props);
        
    }

    render(props) {
        
        return (
            <div>
                {getWidgets().map(widget => {
                    return (<ToolboxItem widget={widget} />);
                })}
            </div>
        );
    }
}

