import { h, Component } from 'preact';
import { FlowEditor } from '../lib/floweditor';
import { nodes } from '../lib/node_definitions';
import { getConfigNodes, loadRuleConfig, storeRuleConfig, storeRule } from '../lib/espeasy';
import { settings } from '../lib/settings';

export class RulesEditorPage extends Component {
    constructor(props) {
        super(props);
        this.nodes = nodes;
        this.devices = settings.get('plugins');
    }

    render(props) {
        return (
            <div class="editor" ref={ref=> this.element = ref}>
            </div>
        );
    }

    componentDidMount() {
        getConfigNodes(this.devices).then((out) => {
            out.nodes.forEach(device => nodes.unshift(device));
            const ifElseNode = nodes.find(node => node.type === 'if/else');
            const setStateNode = nodes.find(node => node.type == 'set state');
            if (!ifElseNode.config[0].loaded) {
                out.vars.forEach(v => ifElseNode.config[0].values.push(v)); 
                ifElseNode.config[0].loaded = true;
            }
            if (!setStateNode.config[0].loaded) {
                out.vars.forEach(v => setStateNode.config[0].values.push(v)); 
                setStateNode.config[0].loaded = true; 
            }

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