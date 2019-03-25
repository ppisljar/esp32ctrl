import { settings } from '../lib/settings';

export const getTasks = () => {
    return settings.get('plugins').map((task, i) => ({ value: i, name: task.name }));
};

export const getTaskValues = (config) => {
    const selectedTask = config.params.device;
    const values = settings.get(`plugins[${selectedTask}].settings.values`);
    if (!values) return [];
    return values.filter(val => val).map((val, i) => ({ value: i, name: val.name }));
};

export class Device {
    constructor() {
        this.vals = 0;
        this.data = false;
        this.params = {};
    }

    defaults() {
        return [];
    };

    getDevicePins() {
        return [];
    };

    getDeviceUsedPins(plugin) {
        const pins = [];
        if (plugin.params.gpio) pins.push(plugin.params.gpio);
        if (plugin.params.gpio1) pins.push(plugin.params.gpio1);
        if (plugin.params.gpio2) pins.push(plugin.params.gpio2);
        if (plugin.params.gpio3) pins.push(plugin.params.gpio3);
        if (plugin.params.gpio4) pins.push(plugin.params.gpio4);
        return pins;
    }
}