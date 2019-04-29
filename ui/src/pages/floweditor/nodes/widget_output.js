import { Component, h } from 'preact';
import { WidgetConnection } from './widget_connection';

export class WidgetOutput extends Component {
  constructor(props) {
      super(props);
  }

    render() {
        const id = `node-${this.props.node.id}-o-${this.props.o}`;
        return (
            <div id={id} className="node-output" ref={el => this.el = el} 
                onContextMenu={this.onRightclick}
            />
        );
    }

  onRightclick = (e) => {
      this.props.onArrow(this.el, null);
      e.preventDefault();
      e.stopPropagation();
  }

  onMouseMove = (e) => {
      this.props.onArrow(this.el, { x: e.pageX - this.offset[0], y: e.pageY - this.offset[1] })
  }

  onMouseDown = (e) => {
    this.offset = [e.layerX, e.layerY];
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
    e.preventDefault();
    e.stopPropagation();
  }

  onMouseUp = (e) => {
    this.offset = null;

    const elemBelow = document.elementFromPoint(e.clientX, e.clientY);
    const input = elemBelow ? elemBelow.closest('.node-input') : null;
    if (!input) {
        this.props.onArrow(this.el, null);
    } else {
        this.props.onArrow(this.el, input.id);
        // const inputRect = input.getBoundingClientRect();
        // this.setState({ x: inputRect.x, y: inputRect.y + inputRect.height/2 });
        //lineSvg.setPath(x1, y1, x2, y2);
        // const connection = {
        //     output,
        //     input,
        //     svg: lineSvg,
        //     start: { x: x1, y: y1 },
        //     end: { x: x2, y: y2 },
        // };
        // output.lines.push(connection);
        // input.lines.push(connection);
    }
    
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  componentDidMount() {
    this.el.addEventListener('mousedown', this.onMouseDown);
  }

  componentWillUnmount() {
    this.el.removeEventListener('mousedown', this.onMouseDown);
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }
}