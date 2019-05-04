import { Component, h } from 'preact';
import { DragSource } from 'preact-dnd';

const style = {
  display: 'inline-block',
  border: '1px dashed gray',
  'border-radius': '5px',
  'text-align': 'center',
  padding: '5px 10px',
  cursor: 'move',
};

const boxSource = {
  beginDrag(props) {
    return props.widget;
  },
};

const collect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
});

class ToolboxItemComponent extends Component {

  render() {
    const { isDragging, connectDragSource, itemStyle } = this.props;
    const { title, group } = this.props.widget;
    const opacity = isDragging ? '0.4' : '1';
    const className = `node group-${group}`;

    return (
      connectDragSource(
        <div className={className} style={{ ...style, ...itemStyle, opacity }}>
          {title}
        </div>
      )
    );
  }
}

export const ToolboxItem = DragSource('box', boxSource, collect)(ToolboxItemComponent);