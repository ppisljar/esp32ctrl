import { Component, h } from "preact";
import { generateWidgetComponent } from "../helper";
import { getTasks, getTaskValues, getTaskValueType, getDeviceById } from "../../../../lib/utils";
import { settings } from "../../../../lib/settings";

const compareValue = (type) => {
    const checkValue = getTaskValueType('params.device', 'params.value', type);
    return (config) => {
        if (config.params.val_type != 255) return false;
        return checkValue(config);
    }
}

const setStateNode = {
    group: 'ACTION',
    name: 'setstate',
    title: 'SET STATE',
    inputs: 1,
    outputs: 1,  
    getEditorConfig: () => {
        const isBit = compareValue(0);
        const isByte = compareValue(1);
        const isInt16 = compareValue(2);
        const isInt32 = compareValue(4);
        const isString = compareValue(5);
        const cfg = {
            groups: {
                params: {
                    name: 'Set State',
                    configs: {
                        device: { name: 'Check Device', type: 'select', options: getTasks },
                        value: { name: 'Check Value', type: 'select', options: getTaskValues('params.device') },
                        val_type: { name: 'Value', type: 'select', options: [{ name: 'state', value: 0 }, { name: 'custom', value: 255 }], var: 'params.val_type' },
                        val_string: { name: 'String', if: isString, type: 'string', var: 'params.val' },
                        val_bit: { name: 'Bit', if: isBit, type: 'select', options: [0, 1], var: 'params.val' },
                        val_byte: { name: 'Byte', if: isByte, type: 'number', min: 0, max: 255, var: 'params.val' },
                        val_int16: { name: 'Int16', if: isInt16, type: 'number', min: 0, max: 65535, var: 'params.val' },
                        val_int32: { name: 'Int32', if: isInt32, type: 'number', min: 0, max: 4294967295, var: 'params.val' },
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
        val_type: 0,
        val: 0,
    }),

    getText: (item) => {
        const { device, value, val } = item.params;
        if (device === undefined || value === undefined) return 'click to configure';
        const d = getDeviceById(device)
        const deviceName = d ? d.name : '';
        const valueName = d ? d.state.values[value].name : '';
        return `set ${deviceName}#${valueName} = ${val}`;
    },

    toDsl: (item) => {
        const { device, value, val, val_type } = item.params;
        const v = val_type === 0 ? 255 : val;
        // F0 DEVICE_ID VAR_ID LENGTH VALUE (length = 1 & value = 255: copy state)
        return [`\xF0${String.fromCharCode(device)}${String.fromCharCode(value)}\x01${String.fromCharCode(v)}`];
    } ,     
}

const component = generateWidgetComponent(setStateNode);

export { setStateNode };