import { settings } from './settings';
import { storeFile, storeRule } from './espeasy';
import { nodes } from '../pages/floweditor/nodes';

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

function stringToAsciiByteArray(str)
{
    var bytes = [];
   for (var i = 0; i < str.length; ++i)
   {
       var charCode = str.charCodeAt(i);
      if (charCode > 0xFF)  // char > 1 byte since charCodeAt returns the UTF-16 value
      {
          throw new Error('Character ' + String.fromCharCode(charCode) + ' can\'t be represented by a US-ASCII byte.');
      }
       bytes.push(charCode);
   }
    return bytes;
}

const prepareRules = () => {
    const rules = settings.editor.get('rules[0]', {});
    const renderedNodes = rules.nodes || [];
    const { connections } = rules;
    // find initial nodes (triggers);
    const triggers = renderedNodes.filter(node => {
        console.log(node);
        return node.group === 'TRIGGERS';
    });

    const eventMap = {
        'init': 0,
    };
    const events = renderedNodes.filter(node => node.name === 'event').map((event, i) => ({ value: i, name: event.config[0].value }));
    events.forEach(event => {
        eventMap[event.name] = event.value;
    });

    let result = '';
    debugger;
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
                    subrule += walkRule(outNode);
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

    return storeRule({ rules: bytes, events: eventMap });
}

export const loadConfig = async () => {
    const cfg = await fetch('/config.json').then(r => {
        settings.user(r.headers.get('user').replace(',','').trim());
        return r.json();
    })

    settings.init(cfg);

    const editor_cfg = await fetch('/editor_config.json').then(r => r.ok ? r.json() : {});
    settings.editor.init(editor_cfg);
};

export const saveConfig = async () => {
    await storeFile('config.json', JSON.stringify(settings.get()));
    await storeFile('editor_config.json', JSON.stringify(settings.editor.get()));
    await prepareRules();
    await prepareAlerts();
}

export const loadRules = async () => {
    const r1 =await fetch('/r1.txt').then(r=>r.json()).catch(r => []);
    const events = await fetch('/events.json').then(r => r.json()).catch(r => []);
    const pins = [];    // report on used pins
    settings.events = events;
    settings.rules = r1;
    settings.r1pins = pins;
}