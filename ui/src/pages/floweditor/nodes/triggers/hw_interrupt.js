import { generateWidgetComponent } from "../helper";
import { settings } from "../../../../lib/settings";

const hwinterruptNode = {
    group: 'TRIGGERS',
    name: 'hardware interrupt',
    title: 'HW INTERRUPT',
    inputs: 0,
    outputs: 1,  
    getEditorConfig: () => {
        return {
            groups: {
                params: {
                    name: 'Interrupt',
                    configs: {
                        int: { name: 'pin', type: 'gpio', pins: window.io_pins.getPins('interrupt') },
                    }
                }
            }
        }
    },

    getComponent: () => {
        return component;
    },

    getDefault: () => ({
        timer: 0,
    }),

    getText: (item) => {
        const t = item.params && item.params.int;
        return `on hw_timer${t}`
    },

    toDsl: (item) => {
        const i = (item.params && item.params.int) || 0;
        return [`\xFF\xFE\x00\xFF\x05${String.fromCharCode(i)}`];
    } ,     
}

const component = generateWidgetComponent(hwinterruptNode);

export { hwinterruptNode }