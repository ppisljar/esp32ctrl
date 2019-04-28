import { Component, h } from 'preact';
import { Widget } from './widget';
import { getTaskValues, getTasks } from '../../../lib/utils';

const style = {
  display: 'inline-block',
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  cursor: 'move',
};

export class Value extends Widget {

    renderComponent() {
        return (<span>${this.props.conf.value}</span>);
    }
}

export const valueEditorConfig = {
    groups: {
        config: {
            name: 'Value',
            configs: {
                device: { name: 'Check Device', type: 'select', options: getTasks, var: 'device' },
                value: { name: 'Check Value', type: 'select', options: getTaskValues('device'), var: 'value' },
            }
        }
        
    }
}