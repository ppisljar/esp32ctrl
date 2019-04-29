import { generateWidgetComponent } from "../helper";

const timerNode = {
    group: 'TRIGGERS',
    name: 'timer',
    title: 'TIMER',
    inputs: 0,
    outputs: 1,  
    getEditorConfig: () => {
        const timerOption = [0, 1, 2, 3, 4, 5, 6, 7];
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
        return `on timer${t}`
    },

    toDsl: (item) => {
        const timer = (item.params && item.params.timer) || 0;
        return [`\xFF\xFE\x00\xFF\x02${String.fromCharCode(timer)}`];
    } ,     
}

const component = generateWidgetComponent(timerNode);

export { timerNode }