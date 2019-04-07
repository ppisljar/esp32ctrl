import { h, Component } from 'preact';
import { Form } from '../components/form';
import { settings } from '../lib/settings';
import { ioPins } from "../lib/pins";

export const pins = () => {
    return ioPins.getPins(['core', 'digital_in', 'digital_out']);
};

const pinState = [
    { name: 'Default', value: 0 },
    { name: 'Low', value: 1 },
    { name: 'High', value: 2 },
    { name: 'Input', value: 3 },
];

const freq = [
    { name: '100kHz', value: 100000 },
    { name: '400kHz', value: 400000 }
];

const timerMode = [
    { name: 'count up', value: 0 },
    { name: 'count down', value: 1 },
];

const dividerHelp = 'Divider for 80MHz clock. This will affect minimum and maximum value you can set your timer to.';

const formConfig = {
    groups: {
        led: {
            name: 'WiFi Status LED',
            configs: {
                gpio: { name: 'GPIO --> LED', type: 'select', options: pins },
                inverse: { name: 'Inversed LED', type: 'checkbox' },
            }
        },
        reset: {
            name: 'Reset Pin',
            configs: {
                pin: { name: 'GPIO <-- Switch', type: 'select', options: pins },
            }
        },
        i2c: {
            name: 'I2C Settings',
            configs: {
                enabled: { name: 'Enabled', type: 'checkbox' },
                sda: { name: 'GPIO - SDA', type: 'select', options: pins },
                scl: { name: 'GPIO - SCL', type: 'select', options: pins },
                freq: { name: 'Frequency', type: 'select', options: freq }
            }
        },
        spi: {
            name: 'SPI Settings',
            configs: {
                enabled: { name: 'Init SPI', type: 'checkbox' },
                sclk: { name: 'GPIO - SCLK', type: 'select', options: pins },
                mosi: { name: 'GPIO - MOSI', type: 'select', options: pins },
                miso: { name: 'GPIO - MISO', type: 'select', options: pins },
                cs: { name: 'GPIO - CS', type: 'select', options: pins },
            }
        },
        sdcard: {
            name: 'SD Card Settings',
            help: 'Requires SPI enabled',
            configs: {
                enabled: { name: 'Enabled', type: 'checkbox' },
            }
        },
        timer: {
            name: 'Hardware Timer config',
            help: dividerHelp,
            configs: {
                t1: [
                    { name: 'T0', type: 'checkbox', var: 'timer[0].enabled' },
                    { name: 'divider', type: 'number', min: 2, max: 65535, var: 'timer[0].divider' },
                    { name: 'mode', type: 'select', options: timerMode, var: 'timer[0].mode' }
                ], 
                t2: [
                    { name: 'T1', type: 'checkbox', var: 'timer[1].enabled' },
                    { name: 'divider', type: 'number', min: 2, max: 65535, var: 'timer[1].divider' },
                    { name: 'mode', type: 'select', options: timerMode, var: 'timer[1].mode' }
                ],
                t3: [
                    { name: 'T2', type: 'checkbox', var: 'timer[2].enabled' },
                    { name: 'divider', type: 'number', min: 2, max: 65535, var: 'timer[2].divider' },
                    { name: 'mode', type: 'select', options: timerMode, var: 'timer[2].mode' }
                ],
                t4: [
                    { name: 'T3', type: 'checkbox', var: 'timer[3].enabled' },
                    { name: 'divider', type: 'number', min: 2, max: 65535, var: 'timer[3].divider' },
                    { name: 'mode', type: 'select', options: timerMode, var: 'timer[3].mode' }
                ]
            }
        },
        bluetooth: {
            name: 'Bluetooth Settings',
            configs: {
                enabled: { name: 'Enabled', type: 'checkbox' },
            }
        },
        gpio: {
            name: 'GPIO boot states',
            configs: 
                [...new Array(32)].map((x, i) => {
                    return [
                        { name: `Pin Mode GPIO-${i}`, type: 'select', options: pinState, var: `gpio.${i}.mode` }, 
                        { name: 'interrupt', type: 'checkbox', if: `hardware.gpio.${i}.mode`, ifval:3, var: `gpio.${i}.interrupt` }
                    ];
                }),
                
                
            
        }
    },
}

export class ConfigHardwarePage extends Component {
    render(props) {
        let config = settings.get('hardware');
        if (!config) {
            config = {}
            settings.set('hardware', {
                i2c: {
                    enabled: false,
                },
                timer: [
                    { enabled: false, divider: 800 },
                    { enabled: false, divider: 800 },
                    { enabled: false, divider: 800 },
                    { enabled: false, divider: 800 },
                ],
                spi: {
                    enabled: false,
                    sclk: 14,
                    mosi: 15,
                    miso: 2,
                    cs: 13,
                },
                sdcard: { enabled: false }
            });
        }
        formConfig.onSave = (values) => {
            settings.set('hardware', values);
            window.location.href='#devices';
        }

        return (
            <Form config={formConfig} selected={config} />
        );
    }
}