import { settings } from './settings';
import { pins } from './pins';

export const getNodes = (devices, vars) => {
    const nodes = [
        // TRIGGERS
        {
            group: 'TRIGGERS',
            type: 'timer',
            inputs: [],
            outputs: [1],
            config: [{
                name: 'timer',
                type: 'select',
                values: [1, 2, 3, 4, 5, 6, 7, 8],
                value: 1,
            }],
            indent: true,
            toString: function () { return `on timer ${this.config[0].value}`; },
            toDsl: function () { return [`\xFF\xFE\x00\xFF\x02${String.fromCharCode(this.config[0].value)}`]; }
        }, {
            group: 'TRIGGERS',
            type: 'event',
            inputs: [],
            outputs: [1],
            config: [{
                name: 'name',
                type: 'text',
                value: 'eventname'
            }],
            indent: true,
            toString: function () { return `event ${this.config[0].value}`; },
            toDsl: function ({ events }) { 
                const event = events.find(e => e.name === this.config[0].value);
                if (!event) return null;
                
                return [`\xFF\xFE\x00\xFF\x01${getString(toByteArray(value,2))}`]; 
            }
        }, {
            group: 'TRIGGERS',
            type: 'clock',
            inputs: [],
            outputs: [1],
            config: [{
                name: 'cron expression',
                type: 'text',
                value: '* * * * * *'
            }],
            indent: true,
            toString: () => { return 'clock'; },
            toDsl: () => { return [`\xFF\xFE\x00\xFF\x08${this.config[0].value}\x00`]; }
        }, {
            group: 'TRIGGERS',
            type: 'system boot',
            inputs: [],
            outputs: [1],
            config: [],
            indent: true,
            toString: function() {
                return `on boot`;
            },
            toDsl: function() {
                return [`\xFF\xFE\x00\xFF\x03\x01`];
            }
        }, {
            group: 'TRIGGERS',
            type: 'hardware timer',
            inputs: [],
            outputs: [1],
            config: [{
                name: 'timer',
                type: 'select',
                values: function () {
                    return settings.get('hardware.timer', []).map((t, i) => ({ name: `timer_${i}`, value: i, enabled: t.enabled })).filter(t => t.enabled);
                },
                value: 0,
            }],
            if: function () {
                return this.config[0].values().length > 0;
            },
            indent: true,
            toString: function () { return `on hw_timer ${this.config[0].value}`; },
            toDsl: function () { return [`\xFF\xFE\x00\xFF\x04${String.fromCharCode(this.config[0].value)}`]; }
        }, {
            group: 'TRIGGERS',
            type: 'hardware interrupt',
            inputs: [],
            outputs: [1],
            config: [{
                name: 'timer',
                type: 'select',
                values: () => {
                    return window.io_pins.getPins('interrupt');
                },
                value: 0,
            }],
            if: function () {
                return this.config[0].values().length > 0;
            },
            indent: true,
            toString: function () { return `on hw_interrupt ${this.config[0].value}`; },
            toDsl: function () { return [`\xFF\xFE\x00\xFF\x05${String.fromCharCode(this.config[0].value)}`]; }
        }, {
            group: 'TRIGGERS',
            type: 'touch',
            inputs: [],
            outputs: [1],
            config: [{
                name: 'trigger',
                type: 'select',
                values: function () {
                    const getTouch = (pin) => [4, 0, 2, 15, 13, 12, 14, 27, 33, 32].findIndex(x => x == pin);
                    return settings.get('hardware.gpio', []).map((t, i) => (t && t.mode == 4 ? { name: `GPIO ${i}`, value: getTouch(i) } : null)).filter(gpio => gpio);
                },
            }],
            if: () => {
                return settings.get('hardware.gpio', []).filter(t => t && t.mode == 4).length > 0;
            },
            indent: true,
            toString: function () {
                const vals = this.config[0].values(); 
                const val = vals.find(v => v.value == this.config[0].value) || { name: '' };
                return `on touch '${val.name}'`; 
            },
            toDsl: function () { return [`\xFF\xFE\x00\xFF\x07${String.fromCharCode(this.config[0].value)}`]; }
        }, {
            group: 'TRIGGERS',
            type: 'bluetooth',
            inputs: [],
            outputs: [1],
            config: [{
                name: 'value',
                type: 'select',
                values: function () {
                    return settings.get('bluetooth.server.values', []).map((t, i) => ({ name: t.name, value: i }));
                },
            }],
            if: () => {
                return settings.get('bluetooth.server.enabled', false);
            },
            toString: function () {
                const vals = this.config[0].values(); 
                const val = vals.find(v => v.value == this.config[0].value) || { name: '' };
                return `on bluetooth '${val.name}'`; 
            },
            toDsl: function () { return [`\xFF\xFE\x00\xFF\x09${String.fromCharCode(this.config[0].value)}`]; }
        } , {
            group: 'TRIGGERS',
            type: 'alexa',
            inputs: [],
            outputs: [1],
            config: [{
                name: 'trigger',
                type: 'select',
                values: function () {
                    return settings.get('alexa.triggers', []).map((t, i) => ({ name: t.name, value: i }));
                },
            }],
            if: () => {
                return settings.get('alexa.triggers', []).length > 0;
            },
            indent: true,
            toString: function () {
                const vals = this.config[0].values(); 
                const val = vals.find(v => v.value == this.config[0].value) || { name: '' };
                return `on alexa '${val.name}'`; 
            },
            toDsl: function () { return [`\xFF\xFE\x00\xFF\x06${String.fromCharCode(this.config[0].value)}`]; }
        } , 
        // LOGIC
        {
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
            indent: true,
            toString: function() {
                const val = this.config[0].values.find(v => v.value == this.config[0].value);
                return `IF ${val ? val.name : ''}${this.config[1].value}${this.config[2].value}`;
            },
            toDsl: function() {
                const eq = this.config[1].values.findIndex(v => v === this.config[1].value);
                const devprop = this.config[0].value.split('-').map(v => String.fromCharCode(v)).join('');
                return [`\xFC\x01${devprop}${String.fromCharCode(eq)}\x01${String.fromCharCode(this.config[2].value)}%%output%%`, `\xFD%%output%%\xFE`];
            }
        }, {
            group: 'LOGIC',
            type: 'delay',
            inputs: [1],
            outputs: [1],
            config: [{
                name: 'delay',
                type: 'number',
            }],
            toString: function() {
                return `delay: ${this.config[0].value}`;
            },
            toDsl: function() {
                return [`\xF4${String.fromCharCode(this.config[0].value)}`];
            }
        },
        // ACTIONS
        {
            group: 'ACTIONS',
            type: 'get state',
            inputs: [1],
            outputs: [1],
            config: [{
                name: 'state',
                type: 'select',
                values: [...vars],
            }],
            toString: function() {
                const val = this.config[0].values.find(v => v.value == this.config[0].value);
                return `GET ${val ? val.name : ''}`;
            },
            toDsl: function() {
                const devprop = this.config[0].value.split('-').map(v => String.fromCharCode(v)).join('');
                return [`\xF7${devprop}\x01`];
            }
        }, {
            group: 'ACTIONS',
            type: 'set state',
            inputs: [1],
            outputs: [1],
            config: [{
                name: 'state',
                type: 'select',
                values: [...vars, { name: 'state', value: 255 }],
            }, {
                name: 'value',
                type: 'select',
                values: [0, 1, { value: 255, name: 'state' }],
            }],
            toString: function() {
                const val = this.config[0].values.find(v => v.value == this.config[0].value);
                const val2 = (this.config[1].value == 255) ? 'state' : this.config[1].value;
                return `SET ${val ? val.name : ''} = ${val2}`;
            },
            toDsl: function() {
                const devprop = this.config[0].value.split('-').map(v => String.fromCharCode(v)).join('');
                return [`\xF0${devprop}\x01${String.fromCharCode(this.config[1].value)}`];
            }
        }, {
            group: 'ACTIONS',
            type: 'fire event',
            inputs: [1],
            outputs: [1],
            config: [{
                name: 'name',
                type: 'select',
                values: (chart) => {
                    const events = chart.renderedNodes.filter(node => node.type === 'event');
                    return events.map((event, i) => ({
                        value: event.config[0].value, name: event.config[0].value
                    }));
                }
            }],
            toString: function() {
                return `event ${this.config[0].value}`;
            },
            toDsl: function({events}) {
                const event = events.find(e => e.name === this.config[0].value);
                if (!event) return '';
                return [`\xF2${getString(toByteArray(event,2))}\x00`];
            }
        }, {
            group: 'ACTIONS',
            type: 'settimer',
            inputs: [1],
            outputs: [1],
            config: [{
                name: 'timer',
                type: 'select',
                values: [1, 2, 3, 4, 5, 6, 7, 8],
            }, {
                name: 'value',
                type: 'number'
            }],
            toString: function() {
                return `timer${this.config[0].value} = ${this.config[1].value}`;
            },
            toDsl: function() {
                return [`\xF3${String.fromCharCode(this.config[0].value)}${String.fromCharCode(this.config[1].value)}`];
            }
        }, {
            group: 'ACTIONS',
            type: 'set hw_timer',
            inputs: [1],
            outputs: [1],
            config: [{
                name: 'timer',
                type: 'select',
                values: function () {
                    return settings.get('hardware.timer', []).map((t, i) => ({ name: `timer_${i}`, value: i, enabled: t.enabled })).filter(t => t.enabled);
                },
            }, {
                name: 'value',
                type: 'text',
                help: 'units: d (day), h (hour), m (minute), s (second), u (milisecond)\nFor example: 4s will wait for 4 seconds.',
            }],
            toString: function() {
                return `hw_timer${this.config[0].value} = ${this.config[1].value}`;
            },
            toDsl: function() {
                const timer = settings.get(`hardware.timer.${this.config[0].value}`);
                const freq = BigInt(80000 / timer.divider);
                const unit = this.config[1].value.substr(-1);
                let time = BigInt(this.config[1].value.substr(0, this.config[1].value.length - 1));
                switch (unit) {
                    //case 'u': break;
                    case 's': time *= BigInt(1000); break;
                    case 'm': time *= BigInt(1000*60); break;
                    case 'h': time *= BigInt(1000*60*60); break;
                    case 'd': time *= BigInt(1000*60*60*24); break;
                }
                const value = freq * time;
                function toByteArray(x, n) {
                    var hexString = x.toString(16);
                    if(hexString.length % 2 > 0) hexString = "0" + hexString;
                    var byteArray = [];
                    for(var i = 0; i < hexString.length; i += 2) {
                        byteArray.push(parseInt(hexString.slice(i, i + 2), 16));
                    }
                    while (byteArray.length < n) byteArray = [0, ...byteArray];
                    return byteArray;
                }
                const getString = (bytes) => {
                    let res = '';
                    for (let i = bytes.length - 1; i >= 0; i--) {
                        res += String.fromCharCode(bytes[i]);
                    }
                    return res;
                };

                return [`\xE2${String.fromCharCode(this.config[0].value)}${getString(toByteArray(value,8))}`];
            }
        }, {
            group: 'ACTIONS',
            type: 'MQTT',
            inputs: [1],
            outputs: [1],
            config: [{
                name: 'topic',
                type: 'text',
            }, {
                name: 'command',
                type: 'text',
            }],
            toString: function() {
                return `mqtt ${this.config[1].value}`;
            },
            toDsl: function() {
                return [`Publish ${this.config[0].value},${this.config[1].value}\n`];
            }
        }, {
            group: 'ACTIONS',
            type: 'HTTP',
            inputs: [1],
            outputs: [1],
            config: [{
                name: 'url',
                type: 'text',
            }],
            toString: function() {
                return `HTTP ${this.config[0].value}`;
            },
            toDsl: function() {
                return [`\xEF${this.config[0].value}\x00`];
            }
        }
    ];

    return nodes;
};