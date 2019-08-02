import { settings } from './settings';
import { storeFile } from './esp';
import { getNodes } from '../pages/floweditor/nodes';
import { stringToAsciiByteArray } from './utils';

const prepareAlerts = () => {
    const alerting = settings.get('alerting');
    if (!alerting || !alerting.enabled) return;

    const alerts = alerting.alerts.map(alert => {
        const trigger = `\xFF\xFE\x00\xFF\x00${String.fromCharCode(alert.triggers.length)}`;
        alert.triggers.forEach(t => {
            trigger += `${String.fromCharCode(t.device)}${String.fromCharCode(t.value_id)}${String.fromCharCode(t.compare)})}\x01`;
            trigger += String.fromCharCode(t.value);
        });
        return trigger;
    }).join('\xFF') + '\xFF';

    return storeFile('alerts.bin', alerts);
}



const prepareRules = async () => {
    const rules = settings.editor.get('rules[0]', {});
    const renderedNodes = rules.nodes || [];
    const { connections } = rules;
    // find initial nodes (triggers);
    const triggers = renderedNodes.filter(node => {
        console.log(node);
        return node.group === 'TRIGGERS' || node.group === 'TRIGGER';
    });

    const eventMap = {
        'init': 0,
    };
    const events = renderedNodes.filter(node => node.name === 'event').map((event, i) => ({ value: i, name: event.params.event }));
    events.forEach(event => {
        eventMap[event.name] = event.value;
    });

    const nodes = getNodes();
    let result = '';
    // for each initial node walk the tree and produce one 'rule'
    triggers.map(trigger => {
        
        const walkRule = (rn) => {
            const r = nodes.find(n => n.name == rn.name);
            const rules = r.toDsl ? r.toDsl(rn, { events }) : [];
            if (rules === null) return null;
            let ruleset = '';
            
            [...new Array(r.outputs)].map((x, outI) => {
                let rule = rules[outI] || r.type;
                let subrule = '';
                let out = connections.find(c => c.from == `node-${rn.id}-o-${outI}`);
                if (out) {
                    let match = out.to.match(/node-(.*)-i-.*/);
                    let outNode = renderedNodes.find(n => n.id == match[1]);
                    if (outNode) subrule += walkRule(outNode);
                } 
                if (rule.includes('%%output%%')) {
                    rule = rule.replace('%%output%%', subrule);
                } else {
                    rule += subrule;
                }
                ruleset += rule;
            });
            
            return ruleset;
        }

        const rule = walkRule(trigger);
        if (rule === null) return;
        result += rule + "\xFF";
    });

    const bytes = stringToAsciiByteArray(result);

    await storeFile('events.json', JSON.stringify(eventMap));
    await storeFile('rules.dat', new Uint8Array(bytes));
}

export const loadConfig = async () => {
    const cfg = await fetch('/config.json').then(r => {
        const header = r.headers.get('user');
        if (header) {
            settings.user(header.replace(',','').trim());
        } 
        // todo: remove
        settings.user('admin');
        return r.json();
    })

    settings.init(cfg);

    settings.events = await fetch('/events.json').then(r => r.json()).catch(r => []);
    settings.r1pins = pins;

    const editor_cfg = await fetch('/editor_config.json').then(r => r.ok ? r.json() : {});
    settings.editor.init(editor_cfg);
};

export const saveConfig = async (config = true, editor = true, rules = true, alerts = true) => {
    if (config) await storeFile('config.json', JSON.stringify(settings.get()));
    if (editor) await storeFile('editor_config.json', JSON.stringify(settings.editor.get()));
    if (rules) await prepareRules();
    if (alerts) await prepareAlerts();
}