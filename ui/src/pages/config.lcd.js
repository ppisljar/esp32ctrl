import { h, Component } from 'preact';
import { Form } from '../components/form';
import { settings } from '../lib/settings';
import { set } from '../lib/helpers';
import { pins } from '../lib/pins';

export const types = [
    { name: '- None -', value: 0 },
    { name: 'Email', value: 1 },
    { name: 'Buzzer', value: 2 },
];

const lcdDriverOptions = [
    { name: 'ILI9341', value: 0 },
    { name: 'SSD1306', value: 1 },
    { name: 'ST7789', value: 2 },
    { name: 'NT35510', value: 3 },
];

const touchDriverOptions = [
    { name: 'XPT2046', value: 0 },
    { name: 'FT5X06', value: 1 },
]

const baseDefaults = {}
const getDefaults = {
    0: () => ({}),
    1: () => ({ // Email
    }), 2: () => ({ // Buzzer
    }),
}

const setDefaultConfig = (type, config) => {
    const defaults = {...baseDefaults, ...getDefaults[type]()};
    Object.keys(defaults).forEach((key) => {
        const val = defaults[key];
        set(config.settings, key, val);
    });
}

const getFormConfig = (config, form) => {
    const values = {};
    
    config.pages.forEach((trigger, i) => {
        values[`${i}_name`] = [{
            name: 'Name',
            value: trigger.name,
            type: 'string',
            var: `pages[${i}].name`,
        }, {
            type: 'button',
            value: 'remove',
            click: () => {
                config.pages.splice(i, 1);
                form.forceUpdate();
            }
        }, {
            type: 'button',
            value: 'edit',
            click: () => {
                window.location.href='#config/lcdscreen/' + i;
            }
        }];
    });

    const widgets = {};
    config.widgets.forEach((trigger, i) => {
        widgets[`${i}_name`] = [{
            name: 'Name',
            value: trigger.name,
            type: 'string',
            var: `widgets[${i}].name`,
        }, {
            type: 'button',
            value: 'remove',
            click: () => {
                config.widgets.splice(i, 1);
                form.forceUpdate();
            }
        }, {
            type: 'button',
            value: 'edit',
            click: () => {
                window.location.href='#config/lcdwidget/' + i;
            }
        }];
    });
    
    return {
        groups: {
            params: {
                name: 'General Settings',
                configs: {
                    enabled: { name: 'Enabled', type: 'checkbox', var: 'enabled' },
                    lcd_driver: { name: 'LCD Driver', type: 'select', options: lcdDriverOptions },
                    touch_driver: { name: 'Touch Driver', type: 'select', options: touchDriverOptions },
                    width: { name: 'Width', type: 'number' },
                    height: { name: 'Height', type: 'number' },
                }
            },
            pages: {
                name: 'Pages',
                configs: {
                    ...values,
                }
            },
            widgets: {
                name: 'Widgets',
                configs: {
                    ...widgets,
                }
            }
        },
    }
}

const firstFreeKey = ($array) => {
  let i = 0;
  while($array.find(e => e.idx == i)) i++;
  return i;
}

// todo: changing protocol needs to update:
// -- back to default (correct default)
// -- field list 
export class ConfigLCDPage extends Component {
    constructor(props) {
        super(props);

        this.config = settings.get(`lcd`);
        if (!this.config) {
            this.config =  { enabled: false, params: { width: 320, height: 240 }, pages: [], widgets: [] };
            settings.set('lcd', this.config);
        }

        this.addTrigger = () => {
            this.config.pages.push({
                name: 'New Value',
                type: 0,
                idx: firstFreeKey(this.config.pages),
            });
            this.forceUpdate();
        }

        this.addWidget = () => {
            this.config.widgets.push({
                name: 'New Widget',
                type: 0,
                items: [],
                idx: firstFreeKey(this.config.widgets),
            });
            this.forceUpdate();
        }
    }

    render(props) {
        
        const formConfig = getFormConfig(this.config, this);
        
        return (
            <div>
                <Form config={formConfig} selected={this.config} />
                <button type="button" onClick={this.addTrigger}>Add Page</button>
                <button type="button" onClick={this.addWidget}>Add Widget</button>
            </div>
        );
    }
}
