import { settings } from '../lib/settings';

export { pins } from '../pages/config.hardware';


export const getTasks = () => {
    return settings.get('plugins').map((task, i) => ({ value: i, name: task.name }));
}

export const getTaskValues = (config) => {
    const selectedTask = config.params.device;
    const values = settings.get(`plugins[${selectedTask}].settings.values`);
    if (!values) return [];
    return values.filter(val => val).map((val, i) => ({ value: i, name: val.name }));
}