import { Component, h } from "preact";
import { generateWidgetComponent, getString, toByteArray } from "../helper";

const settimerNode = {
    group: 'ACTION',
    name: 'settimer',
    title: 'SET TIMER',
    inputs: 1,
    outputs: 1,  
    getEditorConfig: () => {
        const cfg = {
            groups: {
                params: {
                    name: 'SET TIMER',
                    configs: {
                        timer: { name: 'Timer', type: 'select', options: [0, 1, 2, 3, 4, 5, 6, 7] },
                        value: { name: 'Value', type: 'number', min:0, max: 255 },
                    }
                }
            }
        };

        return cfg;
    },

    getComponent: () => {
        return component;
    },

    getDefault: () => ({
        url: ''
    }),

    getText: (item) => {
        const { timer, value } = item.params;
        return `timer${timer} = ${value}`;
    },

    toDsl: (item) => {
        const { timer, value } = item.params;
        return [`\xF3${String.fromCharCode(timer)}${getString(toByteArray(value,2))}`];
    } ,     
}

const component = generateWidgetComponent(settimerNode);

export { settimerNode };