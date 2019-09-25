import { settings } from './settings';
import { get } from './helpers';

export const getTasks = () => {
    return settings.get('plugins').filter(p => p).map((p, i) => ({ value: p.id, name: p.name }));
};

export const getDeviceById = (id) => {
    return settings.get('plugins').find(x => x.id === id);
}

export const getTaskConfigs = (path) => {
    return (config) => {
        const selectedTask = get(config,path);
        const task = settings.get('plugins').find(p => p.id === selectedTask);
        if (!task || !task.params) return [];
        return Object.keys(task.params).filter(val => !val.private).map((val, i) => ({ value: val, name: val }));
    };
}
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

export function stringToAsciiByteArray(str)
{
    var bytes = [];
   for (var i = 0; i < str.length; ++i)
   {
       var charCode = str.charCodeAt(i);
      if (charCode > 0xFF)  // char > 1 byte since charCodeAt returns the UTF-16 value
      {
          throw new Error('Character ' + String.fromCharCode(charCode) + ' can\'t be represented by a US-ASCII byte.');
      }
       bytes.push(charCode);
   }
    return bytes;
}