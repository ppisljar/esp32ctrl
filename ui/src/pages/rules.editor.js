import { h, Component } from 'preact';
import { FlowEditor } from './floweditor';
import { settings } from '../lib/settings';

export class RulesEditorPage extends Component {
    constructor(props) {
        super(props);
        this.devices = settings.get('plugins');
        this.rules = settings.editor.get('rules[0]');
        if (!this.rules) {
            this.rules = {
                nodes: [],
                connections: [],
                name: 'rule1'
            };
            const rules = [this.rules];
            settings.editor.set('rules', rules);
        }

    }

    render(props) {

        return (
            <FlowEditor devices={this.devices} rules={this.rules} />
        );
    }
}