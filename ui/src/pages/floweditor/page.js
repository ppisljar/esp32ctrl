import { h, Component } from 'preact';
import { DropTarget } from 'preact-dnd'
import { settings } from '../../lib/settings';
import { Controlbox } from '../common/controlbox';
import { DropPage } from '../common/DropPage';
import { getNodes } from '../../lib/node_definitions';
import { getConfigNodes } from '../../lib/espeasy';
import { Toolbox } from '../common/toolbox';
import { Label } from '../lcdscreen/widgets/label';
import { nodes } from './nodes';

const containerStyle = {
    height: 'calc(100vh - 52px)',
    flex: '1 1 auto',
    display: 'flex',
}

export class Page extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: null,
            nodes: null,
        }
    }

    onClickHandler = (item) => {
        this.setState({ selected: item });
    }

    getItemComponent = (item) => {
        const node = nodes.find(n => n.name == item.name);
        return node.getComponent();
    }

    getNodes = () => {
        return getConfigNodes(this.props.devices);
    }

    render() {

        const pageStyle = {
            position: 'relative',
            overflow: 'auto',
            flex: '1 1 85%',
        }

        const toolboxStyle = {
            flex: '1 1 15%',
            overflow: 'auto',
            'min-width': '240px',
        }

        const toolboxItemStyle = {
            width: '220px',
            margin: '1px',
        }
        
        const controlStyle = {
            border: '1px solid gray',
            padding: '20px',
            width: '300px',
        };

        return (
            <div id='canvas' style={containerStyle}>
                <Toolbox style={toolboxStyle} itemStyle={toolboxItemStyle} nodes={nodes} />
                <DropPage  style={pageStyle} rules={this.props.rules} grid="5"
                    getComponent={this.getItemComponent}
                    onSelect={this.onClickHandler}  />
                <Controlbox style={controlStyle} item={this.state.selected} nodes={nodes} />
            </div>
        )
    }

}
