import { settings } from './settings';
import { storeFile } from './espeasy';

export const loadConfig = () => {
    return fetch('/config.json').then(r => r.json()).then(c => {
        settings.init(c);
        return c;
    });
};

export const saveConfig = () => {
    return storeFile('config.json', JSON.stringify(settings.get()));
}