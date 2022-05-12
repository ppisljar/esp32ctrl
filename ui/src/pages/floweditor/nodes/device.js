import { settings } from "../../../lib/settings";
import { generateWidgetComponent, getString } from "./helper";
import { getTaskValues, getTaskValueType, getDeviceById } from "../../../lib/utils";

const eqOptions = ['changed', '=', '<', '>', '<=', '>=', '!='];

const compareValue = (type) => {
    const checkValue = getTaskValueType('params.device', 'params.value', type);
    return (config) => {
        if (config.params.eq == '') return false;
        return checkValue(config);
    }
}

function doubleToByteArray(number) {
    var buffer = new ArrayBuffer(8);         // JS numbers are 8 bytes long, or 64 bits
    var longNum = new Float64Array(buffer);  // so equivalent to Float64

    longNum[0] = number;

    return Array.from(new Uint8Array(buffer)).reverse();  // reverse to get little endian
}

function bin2String(array) {
    var result = "";
    for (var i = 0; i < array.length; i++) {
        result += String.fromCharCode(parseInt(array[i], 2));
    }
    return result;
}

const getDeviceNode = (device) => {
    const deviceNode = {
        group: 'TRIGGERS',
        name: device.id,
        title: device.name,
        inputs: 0,
        outputs: 1,  
        getEditorConfig: () => {
            const isBit = compareValue(4);
            const isByte = compareValue(0);
            const isInt16 = compareValue(1);
            const isInt32 = compareValue(2);
            const isString = compareValue(3);
    
            const cfg = {
                groups: {
                    params: {
                        name: device.name,
                        configs: {
                            value: { name: 'Check Value', type: 'select', options: getTaskValues('params.device') },
                            eq: { name: 'Check', type: 'select', options: eqOptions },
                            val_string: { name: 'String', if: isString, type: 'string', var: 'params.val' },
                            val_bit: { name: 'Bit', if: isBit, type: 'select', options: [0, 1], var: 'params.val' },
                            val_byte: { name: 'Byte', if: isByte, type: 'number', min: 0, max: 255, var: 'params.val' },
                            val_int: { name: 'Int16', if: isInt16, type: 'number', min: 0, max: 65535, var: 'params.val' },
                            val_decimal: { name: 'Decimal', if: isInt32, type: 'number', min: 0, max: 4294967295, var: 'params.val' },
                        }
                    }
                }
            };
    
            return cfg;
        },

        getDefault: () => ({
            device: device.id,
            value: 0,
            eq: '',
        }),
    
        getComponent: () => {
            return component;
        },
    
        getText: (item) => {
            const { value, eq, val } = item.params;
            
            const d = getDeviceById(device.id);
            const valueName = d ? d.state.values[value].name : '';
        
            return `on ${device.name}#${valueName} ${eq} ${val}`;
        },
    
        toDsl: (item) => {
            const { value, eq, val } = item.params;
            const d = getDeviceById(device.id);
            const valueType = d ? d.state.values[value].type : '';
            const isBit = valueType == 0;
            const isInt16 = valueType == 1;
            const isInt32 = valueType == 2;
            const isString = valueType == 3;

            const len = isBit ? 1 : isInt16 ? 254 : isInt32 ? 255 : String.length(val);
            const convertedVal = isBit ? String.fromCharCode(val) : isInt16 ? 1 : isInt32 ? getString(doubleToByteArray(val)) : val;
            const comp = eqOptions.findIndex(o => o == eq);
            const comparison = eq === 'changed' ? `\x00\x01` : `${String.fromCharCode(comp)}${String.fromCharCode(len)}${convertedVal}`;
            return [`\xFF\xFE\x00\xFF\x00${String.fromCharCode(device.id)}${String.fromCharCode(value)}${comparison}%%output%%\xFF`]; 
        } ,     
    }
    
    const component = generateWidgetComponent(deviceNode);
    
    return deviceNode;
}


export const getDeviceNodes = () => {
    return settings.get('plugins', []).map(p => getDeviceNode(p)).flat();
}