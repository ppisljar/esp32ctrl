import { Component, h } from "preact";

class SetStateComponent extends Component {
    render() {

    }
}


export const getSetStateNode = (vars) => ({
    group: 'LOGIC',
    type: 'if/else',
    inputs: [1],
    outputs: [1, 2],
     
    config: [{
        name: 'state',
        type: 'select',
        values: [...vars, { name: 'state', value: 255 }],
    },{
        name: 'equality',
        type: 'select',
        values: [' changed ', '=', '<', '>', '<=', '>=', '!='],
        value: 0,
    },{
        name: 'value',
        type: 'text',
        value: '',
    }],
    toString: function() {
        const val = this.config[0].values.find(v => v.value == this.config[0].value);
        return `IF ${val ? val.name : ''}${this.config[1].value}${this.config[2].value}`;
    },
    toDsl: function() {
        const eq = this.config[1].values.findIndex(v => v === this.config[1].value);
        const devprop = this.config[0].value.split('-').map(v => String.fromCharCode(v)).join('');
        return [`\xFC\x01${devprop}${String.fromCharCode(eq)}\x01${String.fromCharCode(this.config[2].value)}%%output%%`, `\xFD%%output%%\xFE`];
    }
});