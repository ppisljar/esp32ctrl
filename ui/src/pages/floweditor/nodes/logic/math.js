import { Component, h } from "preact";
import { generateWidgetComponent } from "../helper";
import { getTaskValueType, getTasks, getTaskValues } from "../../../../lib/utils";

const mathNode = {
    group: 'LOGIC',
    name: 'math',
    title: 'MATH',
    inputs: 1,
    outputs: 2,  
    getEditorConfig: () => {
        return {
            groups: {
                params: {
                    name: 'Expression',
                    configs: {
                        expr: { name: '', type: 'string', help: 'tinymath expression, available vars: "state", "x" and "y"' },
                    }
                }
            }
        }
    },

    getComponent: () => {
        return component;
    },

    getDefault: () => ({
        expr: 'state',
    }),

    getText: (item) => {
        const { expr } = item.params;
        return 'state = ' + expr;
    },

    toDsl: (item) => {
        const { expr } = item.params;
        return [`\xEE${expr}\x00`];
    
    } ,     
}

const component = generateWidgetComponent(mathNode);

export { mathNode };