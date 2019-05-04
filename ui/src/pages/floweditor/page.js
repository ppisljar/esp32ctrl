import { h, Component } from 'preact';
import { Controlbox } from '../common/controlbox';
import { DropPage } from '../common/DropPage';
import { Toolbox } from '../common/toolbox';
import { getNodes } from './nodes';

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

        this.nodes = getNodes();
    }

    onClickHandler = (item) => {
        this.setState({ selected: item });
    }

    getItemComponent = (item) => {
        const node = this.nodes.find(n => n.name == item.name);
        return node.getComponent();
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
                <Toolbox style={toolboxStyle} itemStyle={toolboxItemStyle} nodes={this.nodes} />
                <DropPage  style={pageStyle} rules={this.props.rules} grid="5"
                    getComponent={this.getItemComponent}
                    onSelect={this.onClickHandler}  />
                <Controlbox style={controlStyle} item={this.state.selected} nodes={this.nodes} />
            </div>
        )
    }

}
