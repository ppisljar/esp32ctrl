import { generateWidgetComponent } from "../helper";

const bootNode = {
    group: 'TRIGGERS',
    name: 'system boot',
    title: 'BOOT',
    inputs: 0,
    outputs: 1,  

    getComponent: () => {
        return component;
    },

    getText: (item) => {
        return `on boot`
    },

    toDsl: function (item, { events }) { 
        return [`\xFF\xFE\x00\xFF\x03\x01`];
    } ,     
}

const component = generateWidgetComponent(bootNode);

export { bootNode }