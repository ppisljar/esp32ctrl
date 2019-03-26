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
            configs: {
                0: { name: 'Pin Mode GPIO-0', type: 'select', options: pinState },
                1: { name: 'Pin Mode GPIO-1', type: 'select', options: pinState },
                2: { name: 'Pin Mode GPIO-2', type: 'select', options: pinState },
                3: { name: 'Pin Mode GPIO-3', type: 'select', options: pinState },
                4: { name: 'Pin Mode GPIO-4', type: 'select', options: pinState },
                5: { name: 'Pin Mode GPIO-5', type: 'select', options: pinState },
                9: { name: 'Pin Mode GPIO-9', type: 'select', options: pinState },
                10: { name: 'Pin Mode GPIO-10', type: 'select', options: pinState },
                12: { name: 'Pin Mode GPIO-12', type: 'select', options: pinState },
                13: { name: 'Pin Mode GPIO-13', type: 'select', options: pinState },
                14: { name: 'Pin Mode GPIO-14', type: 'select', options: pinState },
                15: { name: 'Pin Mode GPIO-15', type: 'select', options: pinState },
                16: { name: 'Pin Mode GPIO-16', type: 'select', options: pinState },
                17: { name: 'Pin Mode GPIO-17', type: 'select', options: pinState },
                18: { name: 'Pin Mode GPIO-18', type: 'select', options: pinState },
                19: { name: 'Pin Mode GPIO-19', type: 'select', options: pinState },
                20: { name: 'Pin Mode GPIO-20', type: 'select', options: pinState },
                21: { name: 'Pin Mode GPIO-21', type: 'select', options: pinState },
                22: { name: 'Pin Mode GPIO-22', type: 'select', options: pinState },
                23: { name: 'Pin Mode GPIO-23', type: 'select', options: pinState },
                24: { name: 'Pin Mode GPIO-24', type: 'select', options: pinState },
                25: { name: 'Pin Mode GPIO-25', type: 'select', options: pinState },
                26: { name: 'Pin Mode GPIO-26', type: 'select', options: pinState },
                27: { name: 'Pin Mode GPIO-27', type: 'select', options: pinState },
                28: { name: 'Pin Mode GPIO-28', type: 'select', options: pinState },
                29: { name: 'Pin Mode GPIO-29', type: 'select', options: pinState },
                30: { name: 'Pin Mode GPIO-30', type: 'select', options: pinState },
                31: { name: 'Pin Mode GPIO-31', type: 'select', options: pinState },
                
            }
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