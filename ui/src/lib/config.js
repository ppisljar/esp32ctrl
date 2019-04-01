import { settings } from './settings';
import { storeFile } from './espeasy';

export const loadConfig = () => {
    return fetch('/config.json').then(r => {
        settings.user(r.headers.get('user').replace(',','').trim());
        return r.json();
    }).then(c => {
        settings.init(c);
        return c;
    });
};

export const saveConfig = () => {
    return storeFile('config.json', JSON.stringify(settings.get()));
}

export const loadRules = async () => {
    const r1 =await fetch('/r1.txt').then(r=>r.json());
    const events = await fetch('/events.json').then(r => r.json());
    const pins = [];    // report on used pins
    settings.events = events;
    settings.rules = r1;
    settings.r1pins = pins;
}