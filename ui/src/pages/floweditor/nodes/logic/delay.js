import { Component, h } from "preact";
import { generateWidgetComponent } from "../helper";

const delayNode = {
    group: 'LOGIC',
    name: 'delay',
    title: 'DELAY',
    inputs: 1,
    outputs: 1,  
    getEditorConfig: () => {
        let vars = {};
        return {
            groups: {
                params: {
                    name: 'Set State',
                    configs: {
                        state: { name: 'State', type: 'select', options: [{ name: 'state', value: 255 }] },
                        comp: { name: 'Compare', type: 'select', options: [' changed ', '=', '<', '>', '<=', '>=', '!='] },
                        val: { name: 'Value', type: 'string' }
                    }
                }
            }
        }
    },

    getComponent: () => {
        return component;
    },

    toDsl: () => {
        const eq = this.config[1].values.findIndex(v => v === this.config[1].value);
        const devprop = this.config[0].value.split('-').map(v => String.fromCharCode(v)).join('');
        return [`\xFC\x01${devprop}${String.fromCharCode(eq)}\x01${String.fromCharCode(this.config[2].value)}%%output%%`, `\xFD%%output%%\xFE`];
    
    } ,     
}


const component = generateWidgetComponent(delayNode);

export { delayNode };