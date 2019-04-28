import { Component, h } from 'preact';
import { DragSource } from 'preact-dnd';

const style = {
  display: 'inline-block',
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
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
    const { isDragging, connectDragSource } = this.props;
    const { icon, title } = this.props.widget;
    const opacity = isDragging ? '0.4' : '1';

    return (
      connectDragSource(
        <div style={{ ...style, opacity }}>
          {title}
        </div>
      )
    );
  }
}

export const ToolboxItem = DragSource('box', boxSource, collect)(ToolboxItemComponent);