import { Component, h } from "preact";
import { generateWidgetComponent } from "../helper";

const httpNode = {
    group: 'ACTION',
    name: 'HTTP',
    title: 'HTTP',
    inputs: 1,
    outputs: 1,  
    getEditorConfig: () => {
        const cfg = {
            groups: {
                params: {
                    name: 'Set State',
                    configs: {
                        url: { name: 'Url', type: 'string', var: 'params.url' },
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
        const { url } = item.params;
        return `http ${url}`;
    },

    toDsl: (item) => {
        const { url } = item.params;
        return [`\xEF${url}\x00`];
    } ,     
}

const component = generateWidgetComponent(httpNode);

export { httpNode };