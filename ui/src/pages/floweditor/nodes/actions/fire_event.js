import { Component, h } from "preact";
import { generateWidgetComponent, getString, toByteArray } from "../helper";
import { settings } from "../../../../lib/settings";

const fireeventNode = {
    group: 'ACTION',
    name: 'fire event',
    title: 'FIRE EVENT',
    inputs: 1,
    outputs: 1,  
    getEditorConfig: () => {
        const events = Object.keys(settings.events).map((k, i) => {
            return { name: k, value: i };
        });

        const cfg = {
            groups: {
                params: {
                    name: 'FIRE EVENT',
                    configs: {
                        event: { name: 'Event', type: 'select', options: events },
                    }
                }
            }
        };

        return cfg;
    },

    getComponent: () => {
        return component;
    },

    getText: (item) => {
        const events = Object.keys(settings.events).map((k, i) => {
            return { name: k, value: i };
        });
        const { event } = item.params;
        const eventName = event ? events.find(e => e.value === event).name : '--configure--';
        return `event ${eventName}`;
    },

    toDsl: (item) => {
        const { event } = item.params;
        return [`\xF2${getString(toByteArray(event,2))}\x00`];
    } ,     
}

const component = generateWidgetComponent(fireeventNode);

export { fireeventNode };