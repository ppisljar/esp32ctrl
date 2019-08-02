import { Component, h } from "preact";
import { generateWidgetComponent } from "../helper";

const loggingNode = {
    group: 'LOGIC',
    name: 'logging',
    title: 'LOGGING',
    inputs: 1,
    outputs: 1,  
    getEditorConfig: () => {
        return {
            groups: {
                params: {
                    name: 'Action',
                    configs: {
                        action: { name: '', type: 'select', options:[{ name: 'start', value: 0xe4 }, { name: 'stop', value: 0xe5 }] },
                    }
                }
            }
        }
    },

    getComponent: () => {
        return component;
    },

    getDefault: () => ({
        action: 0xe4,
    }),

    getText: (item) => {
        const { action } = item.params;
        return 'logging = ' + action;
    },

    toDsl: (item) => {
        const { action } = item.params;
        return [String.fromCharCode(action)];
    
    } ,     
}

const component = generateWidgetComponent(loggingNode);

export { loggingNode };