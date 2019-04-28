import { Component, h } from 'preact';
import { Widget } from './widget';

const style = {
  display: 'inline-block',
  backgroundColor: 'white',
  cursor: 'move',
};

export class WidgetComponent extends Widget {

    renderComponent() {
        return (<div style={Object.assign({}, style, { width: (this.props.conf.width || 320) + 'px', height: (this.props.conf.height || 30) + 'px' })}>{this.props.conf.name}</div>);
    }
}