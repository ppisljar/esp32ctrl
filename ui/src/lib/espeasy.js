import miniToastr from 'mini-toastr';
import { loader } from './loader';
import { getNodes } from './node_definitions';

export const getJsonStat = async (url = '') => {
    return await fetch(`${url}/plugin_state/`).then(response => response.json())
}

export const loadDevices = async (url) => {
    return getJsonStat(url); //.then(response => response.Sensors);
}

export const getConfigNodes = async (devices) => {
    const vars = [];
    const deviceNodes = devices.map((device, i) => {
        if (!device) return [];
        const taskValues = device.state ? device.state.values || [] : [];
        taskValues.map((value, j) => vars.push({ value: `${i}-${j}`, name: `${device.name}#${value.name}` }));
        // todo: remove
        const taskValues1 = device.settings ? device.settings.values || [] : [];
        taskValues1.map((value, j) => vars.push({ value: `${i}-${j}`, name: `${device.name}#${value.name}` }));
        if (!vars.length) return [];
        const result = [{
            group: 'TRIGGERS',
            type: device.name || `${i}-${device.type}`,
            inputs: [],
            outputs: [1],
            config: [{
                name: 'variable',
                type: 'select',
                values: taskValues.map(value => value.name),
                value: taskValues.length ? taskValues[0].name : '',
            }, {
                name: 'euqality',
                type: 'select',
                values: [{ name: '', value: 0 }, { name: '=', value: 1 }, { name: '<', value: 2 }, { name: '>', value: 3 }, { name: '<=', value: 4 }, { name: '>=', value: 5 }, { name: '!=', value: 6 }],
                value: '',
            }, {
                name: 'value',
                type: 'number',
            }],
            indent: true,
            toString: function () { 
                const comparison = this.config[1].value === '' ? 'changes' : `${this.config[1].values.find(v => v.value == this.config[1].value).name} ${this.config[2].value}`;
                return `when ${this.type}.${this.config[0].value} ${comparison}`; 
            },
            toDsl: function () { 
                const comparison = this.config[1].value === '' ? `\x00\x01` : `${String.fromCharCode(this.config[1].value)}\x01${String.fromCharCode(this.config[2].value)}`;
                return [`\xFF\xFE\x00\xFF\x00${String.fromCharCode(i)}${String.fromCharCode(this.config[0].value)}${comparison}%%output%%\xFF`]; 
            }
        }];

        return result;
    }).flat();

    const mainNodes = getNodes(deviceNodes, vars);

    return [...mainNodes, ...deviceNodes];
}

export const getVariables = async () => {
    const urls = ['']; //, 'http://192.168.1.130'
    const vars = {};
    await Promise.all(urls.map(async url => {
        const stat = await getJsonStat(url);
        stat.Sensors.map(device => {
            device.TaskValues.map(value => {
                vars[`${stat.System.Name}@${device.TaskName}#${value.Name}`]  = value.Value;
            });
        });
    }));
    return vars;
}

export const getDashboardConfigNodes = async (url) => {
    const devices = await loadDevices(url);
    const vars = [];
    const nodes = devices.map(device => {
        device.TaskValues.map(value => vars.push(`${device.TaskName}#${value.Name}`));
        return [];
    }).flat();

    return { nodes, vars };
}

export const fetchProgress = (url, opts={}) => {
    return new Promise( (res, rej)=>{
        var xhr = new XMLHttpRequest();
        xhr.open(opts.method || 'get', url);
        for (var k in opts.headers||{})
            xhr.setRequestHeader(k, opts.headers[k]);
        xhr.onload = e => res(e.target.responseText);
        xhr.onerror = rej;
        if (xhr.upload && opts.onProgress)
            xhr.upload.onprogress = opts.onProgress; // event.loaded / event.total * 100 ; //event.lengthComputable
        xhr.send(opts.body);
    });
}

export const storeFile = async (filename, data, onProgress) => {
    loader.show();
    const file = data ? new File([new Blob([data])], filename) : filename;
    const fileName = data ? filename : file.name;
    
    return await fetchProgress(`/upload/${fileName}`, {
        method: 'post',
        body: file,
    }, onProgress).then(() => {
        loader.hide();
        miniToastr.success('Successfully saved to flash!', '', 5000);
    }, e => {
        loader.hide();
        miniToastr.error(e.message, '', 5000);
    });
}

export const deleteFile = async (filename) => {    
    return await fetch('/delete/'+filename, { method: 'POST' }).then(() => {
        miniToastr.success('Successfully saved to flash!', '', 5000);
    }, e => {
        miniToastr.error(e.message, '', 5000);
    });
}

export const storeDashboardConfig = async (config) => {
    storeFile('d1.txt', config);
}

export const loadDashboardConfig = async (nodes) => {
    return await fetch('/d1.txt').then(response => response.json());
}

export const storeRuleConfig = async (config) => {
    storeFile('r1.txt', config);
}

export const loadRuleConfig = async () => {
    return await fetch('/r1.txt').then(response => response.json());
}

export const storeRule = async (data) => {
    await storeFile('events.json', JSON.stringify(data.events));
    await storeFile('rules.dat', new Uint8Array(data.rules));
    return;
}

export const getEvents = async (data) => {
    return fetch ('/events.json').then(r => r.json());
}

export default {
    getJsonStat, loadDevices, getConfigNodes, getDashboardConfigNodes, getVariables, storeFile, deleteFile, storeDashboardConfig, loadDashboardConfig, storeRuleConfig, loadRuleConfig, storeRule
}