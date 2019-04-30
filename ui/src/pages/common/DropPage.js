import { h, Component } from 'preact';
import { DropTarget } from 'preact-dnd'
import { WidgetConnection } from '../floweditor/nodes/widget_connection';

class DropPageComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: this.props.rules.nodes,
            connections: this.props.rules.connections,
        }
    }

    onClickHandler = (item) => {
        this.props.onSelect(item);
    }

    onMoveHandler = (e, item) => {
        const x = roundToGrid(e.x - this.position.left + this.el.scrollLeft, this.props.grid);
        const y = roundToGrid(e.y - this.position.top + this.el.scrollTop, this.props.grid);

        const existingItem = this.state.items.find(i => i.id === item.id);
        existingItem.position.x = x;
        existingItem.position.y = y;
        this.forceUpdate();
    }

    onRightClickHandler = (item) => {
        // delete input and output connections
        this.state.connections = this.state.connections.filter(c => {
            return !c.to.startsWith(`node-${item.id}-`) && !c.from.startsWith(`node-${item.id}-`);
        })
        const index = this.state.items.findIndex(i => i.id == item.id);
        this.state.items.splice(index, 1);
        this.forceUpdate();
    }

    onArrow = (from, to) => {
        let c = this.state.connections.find(c => c.from == from.id);
        if (!c) {
            c = { from: from.id, to };
            this.state.connections.push(c);
        } else {            
            c.to = to;
            if (to === null) {
                const index = this.state.connections.findIndex(c => c.from == from.id);
                this.state.connections.splice(index, 1);
            }
        }

        this.forceUpdate();
    }

    findNextId() {
        let x = 0;
        this.state.items.forEach(i => { if (i.id > x) x = i.id; });
        return x + 1;
    }

    renderItem = (item, W) => {

        const itemStyle = {
            position: 'absolute',
            top: `${item.position.y}px`,
            left: `${item.position.x}px`
        };
        
        return (
            <div style={itemStyle}>
                <W 
                    item={item} 
                    onClickHandler={this.onClickHandler} 
                    onRightClickHandler={this.onRightClickHandler} 
                    onMouseMove={this.onMoveHandler}
                    onArrow={this.onArrow}
                />    
            </div>
        )
    }

    renderConnection = (c) => {
        const fel = document.getElementById(c.from);
        if (!fel) return;
        const frect = fel.getBoundingClientRect();
        const x0 = frect.left + frect.width - this.position.left;
        const y0 = frect.top + frect.height / 2 - this.position.top;

        let x1, y1;
        if (c.to && c.to.x) {
            x1 = c.to.x - this.position.left;
            y1 = c.to.y - this.position.top;
        } else if (c.to) {
            const tel = document.getElementById(c.to);
            if (!tel) return;
            const trect = tel.getBoundingClientRect();
            x1 = trect.left - this.position.left;
            y1 = trect.top + trect.height / 2 - this.position.top;
        } else {
            return (null);
        }
        
        return (<WidgetConnection fill="none" color="#000000" from={[x0, y0]} to={[x1, y1]} />);
    }

    render() {
        const { isOver, connectDropTarget } = this.props;

        if (this.el) this.position = this.el.getBoundingClientRect();

        return connectDropTarget(
            <div id={this.props.id} style={this.props.style} ref={el => { this.el = el; }}>
                {this.el && this.state.items.map(item => {
                    return this.renderItem(item, this.props.getComponent(item));
                })}
                <div>
                    {this.el && this.state.connections.map(c => {
                        return this.renderConnection(c);
                    })}
                </div>
            </div>
        )
    }

    componentDidMount() {
        this.forceUpdate();
    }
}

const roundToGrid = (num, grid) => {
    let down = num - num % grid;
    let up = num + grid - num % grid;
    return Math.abs(num - up) < num - down ? up : down;
}

const target = {
    drop(props, monitor, component) {
        const item = monitor.getItem();
        const offset = monitor.getClientOffset();

        const x = roundToGrid(offset.x - component.position.left + component.el.scrollLeft, component.props.grid);
        const y = roundToGrid(offset.y - component.position.top + component.el.scrollTop, component.props.grid);
        if (!item.id) {
            component.state.items.push({
                id: component.findNextId(),
                name: item.name,
                group: item.group,
                params: item.getDefault ? item.getDefault() : {},
                position: { x, y },
            });
        }
    },
}
  
function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
    }
}


export const DropPage = DropTarget('box', target, collect)(DropPageComponent);
