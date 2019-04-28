import { h, Component } from 'preact';
import { DropTarget } from 'preact-dnd'
import { settings } from '../../lib/settings';
import { getWidgets } from './widgets';
import { Controlbox } from './controlbox';

const containerStyle = {
    position: 'relative',
    top: '25px',
}
const style = {
    height: '240px',
    width: '320px',
    position: 'absolute',
    border: '1px solid black',
    overflow: 'scroll',
}

class PageComponent extends Component {
    constructor(props) {
        super(props);

        let items;
        if (props.page) {
            this.width = settings.get(`lcd.params.width`) + 'px';
            this.height = settings.get(`lcd.params.height`) + 'px';

            items = settings.get(`lcd.pages[${props.page}].items`);
            if (!items) {
                items = [];
                settings.set(`lcd.pages[${props.page}].items`, items);
            }
        } else if (props.widget) {
            this.width = settings.get(`lcd.widgets[${props.widget}].width`, settings.get(`lcd.params.width`)) + 'px';
            this.height = settings.get(`lcd.widgets[${props.widget}].height`, 80) + 'px';

            items = settings.get(`lcd.widgets[${props.widget}].items`);
            if (!items) {
                items = [];
                settings.set(`lcd.widgets[${props.widget}].items`, items);
            }
        } else {
            throw('need page or widget nr');
        }

        this.state = {
            items
        }
    }

    onClickHandler = (item) => {
        this.setState({ selected: item });
    }

    onRightClickHandler = (item) => {
        this.state.items.splice(this.state.items.findIndex(i => i.id == item.id), 1);
        this.forceUpdate();
    }

    findNextId() {
        let x = 0;
        this.state.items.forEach(i => { if (i.id > x) x = i.id; });
        return x + 1;
    }

    renderItem = (item) => {
        const itemStyle = {
            position: 'absolute',
            top: `${item.position.y}px`,
            left: `${item.position.x}px`
        };
        const W = getWidgets().find(w => w.name == item.name).component;
        return (
            <span style={itemStyle}><W conf={item} onClickHandler={this.onClickHandler} onRightClickHandler={this.onRightClickHandler} /></span>
        )
    }

    render() {
        const { isOver, connectDropTarget } = this.props;
        return connectDropTarget(
            <div style={containerStyle}>
                
                <div style={Object.assign({}, style, { width: this.width, height: this.height })} ref={el => { this.el = el; }}>
                    {this.state.items.map(item => {
                        return this.renderItem(item);
                    })}
                </div>

                <Controlbox item={this.state.selected} />
            </div>
        )
    }

    componentDidMount() {
        this.position = this.el.getBoundingClientRect();
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
        const oi = monitor.getInitialClientOffset();
        const si = monitor.getInitialSourceClientOffset();
        const co = monitor.getSourceClientOffset();
        const ii = monitor.getDifferenceFromInitialOffset();

        const x = roundToGrid(offset.x - component.position.left + component.el.scrollLeft, component.props.grid);
        const y = roundToGrid(offset.y - component.position.top + component.el.scrollTop, component.props.grid);
        if (!item.id) {
            component.state.items.push({
                id: component.findNextId(),
                name: item.name,
                position: { x, y }
            });
        } else {
            const existingItem = component.state.items.find(i => i.id === item.id);
            existingItem.position.x = x;
            existingItem.position.y = y;
        }
    },
}
  
function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
    }
}


export const Page = DropTarget('box', target, collect)(PageComponent);
