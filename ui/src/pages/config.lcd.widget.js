import { h, Component } from 'preact';
import { Form } from '../components/form';
import { settings } from '../lib/settings';
import { set } from '../lib/helpers';
import { pins } from '../lib/pins';
import { LcdScreen } from './lcdscreen';


export class ConfigLCDWidgetPage extends Component {
    constructor(props) {
        super(props);
        
        const screen = props.params[0];
    }

    render(props) {
        

        return (
            <LcdScreen widget={props.params[0]} />
        );
    }
}

