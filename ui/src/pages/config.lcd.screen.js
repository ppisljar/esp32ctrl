import { h, Component } from 'preact';
import { Form } from '../components/form';
import { settings } from '../lib/settings';
import { set } from '../lib/helpers';
import { pins } from '../lib/pins';
import { LcdScreen } from './lcdscreen';


export class ConfigLCDScreenPage extends Component {
    constructor(props) {
        super(props);
        
        const screen = props.params[0];
    }

    render(props) {
        

        return (
            <LcdScreen page={props.params[0]} />
        );
    }
}

