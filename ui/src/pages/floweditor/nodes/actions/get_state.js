import { Component, h } from "preact";
import { generateWidgetComponent } from "../helper";
import { getTasks, getTaskValues, getTaskValueType } from "../../../../lib/utils";
import { settings } from "../../../../lib/settings";

const targetOptions = [
    { name: 'state', value: 0 },
    { name: 'x', value: 1 },
    { name: 'y', value: 2 },
];

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
                        target: { name: 'Read to', type: 'select', options: targetOptions },
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
        const { device, value, target } = item.params;
        if (device === undefined || value === undefined) return 'click to configure';
        const deviceName = settings.get(`plugins[${device}].name`);
        const valueName = settings.get(`plugins[${device}].state.values[${value}].name`);
        const targetName = targetOptions.find(t => t.value == target).name;
        return `${targetName} = ${deviceName}#${valueName}`;
    },

    toDsl: (item) => {
        const { device, value, target } = item.params;
        return [`\xF7${String.fromCharCode(device)}${String.fromCharCode(target)}${String.fromCharCode(value)}\x01$`];
    } ,     
}

const component = generateWidgetComponent(getStateNode);

export { getStateNode };