import { settings } from './settings';
import { storeFile } from './espeasy';

const prepareAlerts = () => {
    const alerting = settings.get('alerting');
    if (!alerting || !alerting.enabled) return;

    const alerts = alerting.alerts.map(alert => {
        const trigger = `\xFF\xFE\x00\xFF\x00${String.fromCharCode(alert.triggers.length)}`;
        alert.triggers.forEach(t => {
            trigger += `${String.fromCharCode(t.device)}${String.fromCharCode(t.value_id)}${String.fromCharCode(t.compare)})}\x01`;
            trigger += String.fromCharCode(t.value);
        });
        return trigger;
    }).join('\xFF') + '\xFF';

    return storeFile('alerts.bin', alerts);
}

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
    return storeFile('config.json', JSON.stringify(settings.get())).then(() => {
        return prepareAlerts();
    });
}

export const loadRules = async () => {
    const r1 =await fetch('/r1.txt').then(r=>r.json()).catch(r => []);
    const events = await fetch('/events.json').then(r => r.json()).catch(r => []);
    const pins = [];    // report on used pins
    settings.events = events;
    settings.rules = r1;
    settings.r1pins = pins;
}