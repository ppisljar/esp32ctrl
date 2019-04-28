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
    return props.conf;
  },
};

const collect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),

});

class WidgetComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { isDragging, connectDragSource } = this.props;

        if (isDragging) return (null);
        
        return (
          
            connectDragSource(
                <div style={{ ...style }} 
                    onClick={() => { this.props.onClickHandler(this.props.conf) }} 
                    onContextMenu={(e) => { e.preventDefault(); this.props.onRightClickHandler(this.props.conf); }} 
                >
                {this._parentComponent.renderComponent()}
                </div>
            )
        );
    }
}

export const Widget = DragSource('box', boxSource, collect)(WidgetComponent);