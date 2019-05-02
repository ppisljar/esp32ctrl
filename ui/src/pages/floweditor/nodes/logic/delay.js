import { Component, h } from "preact";
import { generateWidgetComponent } from "../helper";

const delayNode = {
    group: 'LOGIC',
    name: 'delay',
    title: 'DELAY',
    inputs: 1,
    outputs: 1,  
    getEditorConfig: () => {
        return {
            groups: {
                params: {
                    name: 'Delay',
                    configs: {
                        val: { name: 'Value', type: 'string' }
                    }
                }
            }
        }
    },

    getComponent: () => {
        return component;
    },

    getText: (item) => {
        const { val } = item.props;
        return `DELAY ${val}`;
    },

    toDsl: () => {
        const { val } = item.props;
        return [`\xF4${String.fromCharCode(val)}`];
    
    } ,     
}


const component = generateWidgetComponent(delayNode);

export { delayNode };