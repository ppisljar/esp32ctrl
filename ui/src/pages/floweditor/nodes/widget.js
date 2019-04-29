import { Component, h } from 'preact';
import { WidgetOutput } from './widget_output';
import { WidgetInput } from './widget_input';

const style = {
  cursor: 'move',
};


export class Widget extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const item = this.props.item;
        const className = `node group-${item.group}`;

        return (
          <div style={{ ...style }} className={className} onDblClick={() => { this.props.onClickHandler(item) }}>
            <div className="node-inputs">
              {[...new Array(this.node.inputs)].map(() => {
                return (<WidgetInput node={item} />);
              })}
            </div>
            
            <div className="node-outputs">
              {[...new Array(this.node.outputs)].map((x, i) => {
                return (<WidgetOutput node={item} o={i} onArrow={this.props.onArrow} />);
              })}
            </div>

            <div style={{ display: 'inline-block' }} ref={e => this.base = e} onContextMenu={(e) => { e.preventDefault(); this.props.onRightClickHandler(item); }} >
              {this.renderComponent()}
            </div>
          </div>
        );
    }

    onMouseMove = (e) => {
      this.props.onMouseMove({ x: e.pageX - this.offset[0], y: e.pageY - this.offset[1] }, this.props.item);
    }

    onMouseDown = (e) => {
      this.offset = [e.layerX, e.layerY];
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    }

    onMouseUp = () => {
      this.offset = null;
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
    }

    componentDidMount() {
      this.base.addEventListener('mousedown', this.onMouseDown);
    }

    componentWillUnmount() {
      this.base.removeEventListener('mousedown', this.onMouseDown);
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
    }
}