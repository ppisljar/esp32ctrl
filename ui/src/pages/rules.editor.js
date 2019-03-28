import { h, Component } from 'preact';
import { FlowEditor } from '../lib/floweditor';
import { getConfigNodes, loadRuleConfig, storeRuleConfig, storeRule } from '../lib/espeasy';
import { settings } from '../lib/settings';

export class RulesEditorPage extends Component {
    constructor(props) {
        super(props);
        this.devices = settings.get('plugins');
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
                    storeRuleConfig(config);
                    storeRule(rules);
                }
            });
    
            loadRuleConfig().then(config => {
                this.chart.loadConfig(config);
            });
        });
    }
}