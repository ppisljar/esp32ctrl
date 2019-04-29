import { Component, h } from "preact";
import { generateWidgetComponent } from "../helper";
import { getTasks, getTaskValues, getTaskValueType } from "../../../../lib/utils";
import { settings } from "../../../../lib/settings";

const getStateNode = {
    group: 'ACTION',
    name: 'getstate',
    title: 'GET STATE',
    inputs: 1,
    outputs: 1,  
    getEditorConfig: () => {
        const cfg = {
            groups: {
                params: {
                    name: 'Get State',
                    configs: {
                        device: { name: 'Check Device', type: 'select', options: getTasks },
                        value: { name: 'Check Value', type: 'select', options: getTaskValues('params.device') },
                    }
                }
            }
        };

        return cfg;
    },

    getComponent: () => {
        return component;
    },

    getText: (item) => {
        const { device, value } = item.params;
        if (device === undefined || value === undefined) return 'click to configure';
        const deviceName = settings.get(`plugins[${device}].name`);
        const valueName = settings.get(`plugins[${device}].state.values[${value}].name`);
        return `get ${deviceName}#${valueName}`;
    },

    toDsl: (item) => {
        const { device, value } = item.params;
        return [`\xF7${String.fromCharCode(device)}${String.fromCharCode(value)}\x01$`];
    } ,     
}

const component = generateWidgetComponent(getStateNode);

export { getStateNode };