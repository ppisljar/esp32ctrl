import { settings } from './settings';
import { get } from './helpers';

export const getTasks = () => {
    return settings.get('plugins').filter(p => p).map((p, i) => ({ value: p.id, name: p.name }));
};

export const getTaskValues = (path) => {
    return (config) => {
        const selectedTask = get(config,path);
        const task = settings.get('plugins').find(p => p.id === selectedTask);
        if (!task || !task.state || !task.state.values) return [];
        return task.state.values.filter(val => val).map((val, i) => ({ value: i, name: val.name }));
    };
};

export const getTaskValueType = (taskPath, valuePath, type) => {
    
    return (config) => {
        const selectedTask = get(config, taskPath);
        const task = settings.get('plugins').find(p => p.id === selectedTask);
        if (!task || !task.state || !task.state.values) return false;

        const selectedValue = get(config, valuePath);
        const value = task.state.values[selectedValue];
        if (!value) return false;

        return value.type == type;
    };
};