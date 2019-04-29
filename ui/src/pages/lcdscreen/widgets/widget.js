import { Component, h } from 'preact';
import { DragSource } from 'preact-dnd';

const style = {
  display: 'inline-block',
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  cursor: 'move',
};


export class Widget extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        return (
          <div style={{ ...style }} ref={e => this.base = e}
              onDblClick={() => { this.props.onClickHandler(this.props.conf) }}
              onContextMenu={(e) => { e.preventDefault(); this.props.onRightClickHandler(this.props.conf); }} 
          >
            {this.renderComponent()}
          </div>
        );
    }

    onMouseMove = (e) => {
      this.props.onMouseMove({ x: e.pageX - this.offset[0], y: e.pageY - this.offset[1] }, this.props.conf);
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