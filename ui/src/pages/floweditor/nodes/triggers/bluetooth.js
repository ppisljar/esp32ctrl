import { generateWidgetComponent } from "../helper";
import { settings } from "../../../../lib/settings";

const bluetoothNode = {
    group: 'TRIGGERS',
    name: 'bluetooth',
    title: 'BLuETOOTH',
    inputs: 0,
    outputs: 1,  
    getEditorConfig: () => {
        const btOptions = () => {
            return settings.get('bluetooth.server.values', []).map((t, i) => ({ name: t.name, value: i }));
        }
        return {
            groups: {
                params: {
                    name: 'Interrupt',
                    configs: {
                        value: { name: 'pin', type: 'select', options: btOptions },
                    }
                }
            }
        }
    },

    getComponent: () => {
        return component;
    },

    getDefault: () => ({
        touch: 0,
    }),

    getText: (item) => {
        const t = item.params && item.params.value;
        return `on bluetooth${t}`
    },

    toDsl: (item) => {
        const t = (item.params && item.params.value) || 0;
        return [`\xFF\xFE\x00\xFF\x09${String.fromCharCode(t)}`];
    } ,     
}

const component = generateWidgetComponent(bluetoothNode);

export { bluetoothNode }