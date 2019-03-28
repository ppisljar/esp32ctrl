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
]

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
                ss: { name: 'GPIO - SS', type: 'select', options: pins },
            }
        },
        timer: {
            name: 'Hardware Timer config',
            configs: {
                t1_enabled: { name: 'T1 enabled', type: 'checkbox' },
                t1_divider: { name: 'T1 divider', type: 'number', min: 2, max: 65535 },
                ti_mode: { name: 'T1 mode', type: 'select', options: timerMode },
                t2_enabled: { name: 'T2 enabled', type: 'checkbox' },
                t2_divider: { name: 'T2 divider', type: 'number', min: 2, max: 65535 },
                t2_mode: { name: 'T2 mode', type: 'select', options: timerMode },
                t3_enabled: { name: 'T3 enabled', type: 'checkbox' },
                t3_divider: { name: 'T3 divider', type: 'number', min: 2, max: 65535 },
                t3_mode: { name: 'T3 mode', type: 'select', options: timerMode },
                t4_enabled: { name: 'T4 enabled', type: 'checkbox' },
                t4_divider: { name: 'T4 divider', type: 'number', min: 2, max: 65535 },
                t4_mode: { name: 'T4 mode', type: 'select', options: timerMode },
            }
        },
        bluetooth: {
            name: 'Bluetooth Settinggs',
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
            settings.set('hardware', {});
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