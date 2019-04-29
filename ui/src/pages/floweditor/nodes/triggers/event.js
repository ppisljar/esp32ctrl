import { generateWidgetComponent } from "../helper";

const eventNode = {
    group: 'TRIGGERS',
    name: 'event',
    title: 'EVENT',
    inputs: 0,
    outputs: 1,  
    getEditorConfig: () => {
        return {
            groups: {
                params: {
                    name: 'Timer',
                    configs: {
                        event: { name: 'Event', type: 'string' },
                    }
                }
            }
        }
    },

    getComponent: () => {
        return component;
    },

    getDefault: () => ({
        event: '',
    }),

    getText: (item) => {
        const t = item.params && item.params.event;
        return `on ${t}`
    },

    toDsl: function (item, { events }) { 
        const event = events.find(e => e.name === item.params.event);
        if (!event) return null;
        
        return [`\xFF\xFE\x00\xFF\x01${getString(toByteArray(event.value,2))}`]; 
    } ,     
}

const component = generateWidgetComponent(eventNode);

export { eventNode }