import { Component, h } from 'preact';
import { Widget } from './widget';

const style = {
  border: '1px dashed gray',
  cursor: 'move',
  position: 'relative',
};

const titleStyle = {
    position: 'relative',
    top: '-10px',
    background: 'white',
}

export class Box extends Widget {

    renderComponent() {
        const { width, height } = this.props.conf;
        // style.width = this.props.conf.width + 'px';
        // style.height = this.props.conf.height + 'px';
        style.margin = `${width}px ${height}px`;
        return (<div style={style}><span style={titleStyle}>{this.props.conf.text}</span></div>);
    }
}

export const boxEditorConfig = {
    groups: {
        config: {
            name: 'Box',
            configs: {
                text: { name: 'Title', type: 'string', var: 'text' },
                width: { name: 'Width', type: 'number', var: 'width' },
                height: { name: 'Height', type: 'number', var: 'height' },
            }  
        }
    }
}