import { generateWidgetComponent } from "../helper";
import { settings } from "../../../../lib/settings";

const hwtimerNode = {
    group: 'TRIGGERS',
    name: 'hardware timer',
    title: 'HW TIMER',
    inputs: 0,
    outputs: 1,  
    getEditorConfig: () => {
        const timerOption = settings.get('hardware.timer', []).map((t, i) => ({ name: `timer_${i}`, value: i, enabled: t.enabled })).filter(t => t.enabled);
        return {
            groups: {
                params: {
                    name: 'Timer',
                    configs: {
                        timer: { name: 'Timer', type: 'select', options: timerOption },
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
        const t = item.params && item.params.timer;
        return `on hw_timer${t}`
    },

    toDsl: (item) => {
        const timer = (item.params && item.params.timer) || 0;
        return [`\xFF\xFE\x00\xFF\x04${String.fromCharCode(timer)}`];
    } ,     
}

const component = generateWidgetComponent(hwtimerNode);

export { hwtimerNode }