import { Component, h } from "preact";
import { generateWidgetComponent } from "../helper";
import {
    getTasks,
    getTaskValues,
    getTaskValueType,
    getDeviceById,
    getTaskConfigObj,
    getTaskConfigs
} from "../../../../lib/utils";
import { settings } from "../../../../lib/settings";

const compareValue = (type) => {
    const checkValue = getTaskValueType('params.device', 'params.value', type);
    return (config) => {
        if (config.params.val_type != 255) return false;
        return checkValue(config);
    }
}

const setConfigNode = {
    group: 'ACTION',
    name: 'setconfig',
    title: 'SET CONFIG',
    inputs: 1,
    outputs: 1,  
    getEditorConfig: (params) => {

        const cfg = {
            groups: {
                params: {
                    name: 'Set Config',
                    configs: {
                        device: { name: 'Check Device', type: 'select', options: getTasks },
                        value: { name: 'Check Value', type: 'select', options: getTaskConfigs('params.device') },
                        val_type: { name: 'Value', type: 'select', options: [{ name: 'state', value: 0 }, { name: 'custom', value: 255 }], var: 'params.val_type' },
                        val: () => {
                            const valueObj = getTaskConfigObj(params.device, params.value);
                            return { ...valueObj, var: 'params.val' }
                        },
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
        device: 0,
        value: 0,
        val_type: 255,
    }),

    getText: (item) => {
        const { device, value, val } = item.params;
        if (device === undefined || value === undefined) return 'click to configure';
        const d = getDeviceById(device);
        const deviceName = d ? d.name : '';
        return `set ${deviceName}#${value} = ${val}`;
    },

    toDsl: (item) => {
        const { device, value, val, val_type } = item.params;
        const v = val_type === 0 ? 255 : val;
        // F0 DEVICE_ID VAR_ID LENGTH VALUE (length = 1 & value = 255: copy state)
        return [`\xF0${String.fromCharCode(device)}${String.fromCharCode(value)}\x01${String.fromCharCode(v)}`];
    } ,     
}

const component = generateWidgetComponent(setConfigNode);

export { setConfigNode };