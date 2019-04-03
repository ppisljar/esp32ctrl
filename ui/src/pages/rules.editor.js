import { h, Component } from 'preact';
import { FlowEditor } from '../lib/floweditor';
import { getConfigNodes, loadRuleConfig, storeRuleConfig, storeRule } from '../lib/espeasy';
import { settings } from '../lib/settings';

export class RulesEditorPage extends Component {
    constructor(props) {
        super(props);
        this.devices = settings.get('plugins');
        this.rules = settings.rules;
    }

    render(props) {
        return (
            <div class="editor" ref={ref=> this.element = ref}>
            </div>
        );
    }

    componentDidMount() {
        getConfigNodes(this.devices).then((nodes) => {
            
            this.chart = new FlowEditor(this.element, nodes, { 
                onSave: (config, rules) => {
                    settings.rules = JSON.parse(config);
                    storeRuleConfig(config);
                    storeRule(rules);
                }
            });
    
            this.chart.loadConfig(this.rules);
        });
    }
}