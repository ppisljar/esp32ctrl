import { Component, h } from "preact";
import { generateWidgetComponent, getString, toByteArray } from "../helper";
import { getTasks, getTaskValues, getTaskValueType } from "../../../../lib/utils";
import { settings } from "../../../../lib/settings";

const setHwTimerNode = {
    group: 'ACTION',
    name: 'sethwtimer',
    title: 'SET HW TIMER',
    inputs: 1,
    outputs: 1,  
    getEditorConfig: () => {
        const units = [
            { name: 'milliseconds', value: 0 },
            { name: 'seconds', value: 1 },
            { name: 'minutes', value: 2 },
            { name: 'hours', value: 3 },
            { name: 'days', value: 4 },
        ];

        const getTimers = () => {
            return settings.get('hardware.timer', []).map((t, i) => ({ name: `timer_${i}`, value: i, enabled: t.enabled })).filter(t => t.enabled);
        };

        const cfg = {
            groups: {
                params: {
                    name: 'Set Hw Timer',
                    configs: {
                        timer: { name: 'Timer', type: 'select', options: getTimers },
                        value: { name: 'Value', type: 'number', min: 0, max: 43243423 },
                        unit: { name: 'Unit', type: 'select', options: units },
                    }
                }
            }
        };

        return cfg;
    },

    getComponent: () => {
        return component;
    },

    getText: (item) => {
        const { timer, value, unit } = item.params;
        return `set hwtimer${timer} = ${value}${unit}`;
    },

    toDsl: (item) => {
        const { timer, value, unit } = item.params;
        const timerCfg = settings.get(`hardware.timer.${timer}`);
        const freq = BigInt(80000 / timerCfg.divider);
        let time = BigInt(value);
        
        switch (unit) {
            //case 'u': break;
            case 1: time *= BigInt(1000); break;
            case 2: time *= BigInt(1000*60); break;
            case 3: time *= BigInt(1000*60*60); break;
            case 4: time *= BigInt(1000*60*60*24); break;
        }

        const wait = freq * time;
        
        return [`\xE2${String.fromCharCode(timer)}${getString(toByteArray(wait,8))}`];
    } ,     
}

const component = generateWidgetComponent(setHwTimerNode);

export { setHwTimerNode };