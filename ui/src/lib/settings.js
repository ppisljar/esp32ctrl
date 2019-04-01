import { get, set, getKeys } from './helpers';

const diff = (obj1, obj2, path = '') => {
    const keys = [ ...new Set([...getKeys(obj1), ...getKeys(obj2)])];
    return keys.map(key => {
        const val1 = obj1[key];
        const val2 = obj2[key];
        if (val1 instanceof Object && val2 instanceof Object) return diff(val1, val2, path ? `${path}.${key}` : key);
        else if (val1 !== val2) {
            return [{ path: `${path}.${key}`, val1, val2 }];
        } else return [];
    }).flat();
};

class Settings {
    init(settings) {
        this.settings = settings;
        this.apply();
    }

    user(userName) {
        this.userName = userName;
    }

    get(prop = -1, defs = null) {
        if (prop === -1) return this.settings;
        return get(this.settings, prop, defs);
    }

    /**
     * sets changes to the current version and sets changed flag
     * @param {*} prop 
     * @param {*} value 
     */
    set(prop, value) {
        const obj = get(this.settings, prop);
        if (typeof obj  === 'object') {
            console.warn('settings an object!');
            set(this.settings, prop, value);
        } else {
            set(this.settings, prop, value);
        }
        
        if (this.diff().length) this.changed = true;
    }

    getRules() {
        return this.rules;
    }

    setRules(rules) {
        this.storedRules = JSON.parse(JSON.stringify(rules));
        this.rulesChanged = false;
    }

    /**
     * returns diff between applied and current version
     */
    diff() {
        return diff(this.stored, this.settings);
    }

    /***
     * applys changes and creates new version in localStorage
     */
    apply() {
        this.stored = JSON.parse(JSON.stringify(this.settings));
        this.changed = false;
    }
}

export const settings = window.settings1 = new Settings();