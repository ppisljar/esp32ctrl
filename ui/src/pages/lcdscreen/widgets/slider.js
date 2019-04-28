import { Component, h } from 'preact';
import { Widget } from './widget';
import { getTasks, getTaskValues } from '../../../lib/utils';

const style = {
  display: 'inline-block',
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  cursor: 'move',
};

export class Slider extends Widget {
    renderComponent() {
        return (<input type="range" max={this.props.conf.max} min={this.props.conf.min}></input>);
    }
}

export const sliderEditorConfig = {
    groups: {
        config: {
            name: 'Slider',
            configs: {
                device: { name: 'Check Device', type: 'select', options: getTasks, var: 'device' },
                value: { name: 'Check Value', type: 'select', options: getTaskValues('device'), var: 'value' },
                event: { name: 'Event', type: 'string', var: 'event' },
                min: { name: 'Min', type: 'number', var: 'min' },
                max: { name: 'Max', type: 'number', var: 'max' },
            }
        }
    }
}