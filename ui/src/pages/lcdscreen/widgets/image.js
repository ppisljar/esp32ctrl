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

export class Image extends Widget {

    renderComponent() {
        return (null);
    }
}