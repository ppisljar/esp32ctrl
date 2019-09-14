import { Component, h } from "preact";
import { generateWidgetComponent } from "../helper";
import { getTaskValueType, getTasks, getTaskValues, getDeviceById } from "../../../../lib/utils";
import { settings } from "../../../../lib/settings";

const eqOptions = ['changed', '=', '<', '>', '<=', '>=', '!='];

const compareValue = (type) => {
    const checkValue = getTaskValueType('params.device', 'params.value', type);
    return (config) => {
        if (config.params.val_type != 255) return false;
        return checkValue(config);
    }
}

const ifElseNode = {
    group: 'LOGIC',
    name: 'if/else',
    title: 'IF / ELSE',
    inputs: 1,
    outputs: 2,  
    getEditorConfig: () => {
        const isBit = compareValue(0);
        const isByte = compareValue(1);
        const isInt16 = compareValue(2);
        const isInt32 = compareValue(4);
        const isString = compareValue(5);
        const notChanged = config => { console.log(config.params); return config.params.eq != 'changed' };
        return {
            groups: {
                params: {
                    name: 'IF',
                    configs: {
                        device: { name: 'Check Device', type: 'select', options: getTasks },
                        value: { name: 'Check Value', type: 'select', options: getTaskValues('params.device') },
                        eq: { name: 'Check', type: 'select', options: eqOptions },
                        val_type: { name: 'Value', type: 'select', if: notChanged, options: [{ name: 'state', value: 0 }, { name: 'custom', value: 255 }], var: 'params.val_type' },
                        val_string: { name: 'String', if: isString, type: 'string', var: 'params.val' },
                        val_bit: { name: 'Bit', if: isBit, type: 'select', options: [0, 1], var: 'params.val' },
                        val_byte: { name: 'Byte', if: isByte, type: 'number', min: 0, max: 255, var: 'params.val' },
                        val_int16: { name: 'Int16', if: isInt16, type: 'number', min: 0, max: 65535, var: 'params.val' },
                        val_int32: { name: 'Int32', if: isInt32, type: 'number', min: 0, max: 4294967295, var: 'params.val' },
                    }
                }
            }
        }
    },

    getComponent: () => {
        return component;
    },

    getDefault: () => ({
        state: 255,
        val: 0,
    }),

    getText: (item) => {
        const { device, value, val, eq, val_type } = item.params;
        if (device === undefined || value === undefined) return 'click to configure';
        const d = getDeviceById(device)
        const deviceName = d ? d.name : '';
        const valueName = d ? d.state.values[value].name : '';
        let text = `IF ${deviceName}#${valueName} ${eq} `;
        if (eq !== 'changed') {
            text += val_type ? val : '[state]';
        }
        return text;
    },

    toDsl: (item) => {
        const { device, value, val, eq, val_type } = item.params;
        const comp = eqOptions.findIndex(o => o == eq);
        const sendval = val_type === 0 ? 255 : val;
        return [`\xFC\x01${String.fromCharCode(device)}${String.fromCharCode(value)}${String.fromCharCode(comp)}\x01${String.fromCharCode(sendval)}%%output%%`, `\xFD%%output%%\xFE`];
    
    } ,     
}

const component = generateWidgetComponent(ifElseNode);

export { ifElseNode };