import { generateWidgetComponent } from "../helper";
import { settings } from "../../../../lib/settings";

const alexaNode = {
    group: 'TRIGGERS',
    name: 'alexa',
    title: 'ALEXA',
    inputs: 0,
    outputs: 1,  
    getEditorConfig: () => {
        const alexaOptions = () => {
            return settings.get('alexa.triggers', []).map((t, i) => ({ name: t.name, value: i }));
        }
        return {
            groups: {
                params: {
                    name: 'Alexa',
                    configs: {
                        trigger: { name: 'Trigger', type: 'select', options: alexaOptions },
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
        return `on alexa${t}`
    },

    toDsl: (item) => {
        const t = (item.params && item.params.value) || 0;
        return [`\xFF\xFE\x00\xFF\x06${String.fromCharCode(t)}`];
    } ,     
}

const component = generateWidgetComponent(alexaNode);

export { alexaNode }