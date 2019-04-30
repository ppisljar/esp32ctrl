import { generateWidgetComponent } from "../helper";

const clockNode = {
    group: 'TRIGGERS',
    name: 'clock',
    title: 'CRON',
    inputs: 0,
    outputs: 1,  
    getEditorConfig: () => {
        return {
            groups: {
                params: {
                    name: 'Cron',
                    configs: {
                        expr: { name: 'Cron Expr', type: 'string' },
                    }
                }
            }
        }
    },

    getComponent: () => {
        return component;
    },

    getDefault: () => ({
        expr: '* * * * * *',
    }),

    getText: (item) => {
        const t = item.params && item.params.expr;
        return `on ${t}`
    },

    toDsl: function (item, { events }) { 
        const t = item.params && item.params.expr;
        
        return [`\xFF\xFE\x00\xFF\x08${t}\x00`];
    } ,     
}

const component = generateWidgetComponent(clockNode);

export { clockNode }