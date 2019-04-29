import { Component, h } from "preact";
import { generateWidgetComponent } from "../helper";

const mqttNode = {
    group: 'ACTION',
    name: 'MQTT',
    title: 'MQTT',
    inputs: 1,
    outputs: 1,  
    getEditorConfig: () => {
        const cfg = {
            groups: {
                params: {
                    name: 'MQTT',
                    configs: {
                        topic: { name: 'Topic', type: 'string', var: 'params.topic' },
                        command: { name: 'Command', type: 'string', var: 'params.command' },
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
        return `mqtt ${url}`;
    },

    toDsl: (item) => {
        const { url } = item.params;
        return [`\xEF${url}\x00`];
    } ,     
}

const component = generateWidgetComponent(mqttNode);

export { mqttNode };