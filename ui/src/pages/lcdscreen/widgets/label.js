import { Component, h } from 'preact';
import { Widget } from './widget';

const style = {
  display: 'inline-block',
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  cursor: 'move',
};

export class Label extends Widget {

    renderComponent() {
        if (this.props.conf.text === undefined) { this.props.conf.text = 'label' };
        return (<span>{this.props.conf.text}</span>);
    }
}

export const labelEditorConfig = {
    groups: {
        config: {
            name: 'Label',
            configs: {
                text: { name: 'Text', type: 'string', var: 'text' },
            }
        }
        
    }
}