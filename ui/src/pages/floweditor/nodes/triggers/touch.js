import { generateWidgetComponent } from "../helper";
import { settings } from "../../../../lib/settings";

const touchNode = {
    group: 'TRIGGERS',
    name: 'touch',
    title: 'TOUCH',
    inputs: 0,
    outputs: 1,  
    getEditorConfig: () => {
        const touchOptions = () => {
            const getTouch = (pin) => [4, 0, 2, 15, 13, 12, 14, 27, 33, 32].findIndex(x => x == pin);
            return settings.get('hardware.gpio', []).map((t, i) => (t && t.mode == 4 ? { name: `GPIO ${i}`, value: getTouch(i) } : null)).filter(gpio => gpio);
        }
        return {
            groups: {
                params: {
                    name: 'Interrupt',
                    configs: {
                        touch: { name: 'pin', type: 'select', options: touchOptions },
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
        const t = item.params && item.params.touch;
        return `on touch${t}`
    },

    toDsl: (item) => {
        const t = (item.params && item.params.touch) || 0;
        return [`\xFF\xFE\x00\xFF\x07${String.fromCharCode(t)}`];
    } ,     
}

const component = generateWidgetComponent(touchNode);

export { touchNode }