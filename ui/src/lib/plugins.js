import { settings } from './settings';
import espeasy from './espeasy';
import { loader } from './loader';
import { menu } from './menu';


const dynamicallyLoadScript = (url) => {
    return new Promise(resolve => {
        var script = document.createElement("script");  // create a script DOM node
        script.src = url;  // set its src to the provided URL
        script.onreadystatechange = resolve;
        script.onload = resolve;
        script.onerror = resolve;
        document.head.appendChild(script);  // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
    });
}

const onPageLoadHandlers = [];
const page = {
    appendStyles: (url) => {
        return new Promise(resolve => {
            const link = document.createElement('link');
            link.type = 'text/css';
            link.rel = 'stylesheet';
            link.onload = () => {
                resolve();
            }
            link.href = url;

            if (!document.querySelector('link[href="' + url + '"]')) {
                let headScript = document.querySelector('head');
                headScript.append(link);
            }
        });
    },
    
    appendScript: dynamicallyLoadScript,

    onLoad: (fn) => {
        onPageLoadHandlers.push(fn);
    }
};

const getPluginAPI = () => {
    return {
        settings,
        loader,
        menu,
        espeasy,
        page,
    }
}

window.getPluginAPI = getPluginAPI;

export const firePageLoad = () => {
    onPageLoadHandlers.forEach(h => h());
}

export const loadPlugins = async () => {
    return Promise.all(settings.editor.get('ui_plugins', []).filter(p => p.enabled).map(async plugin => {
        return dynamicallyLoadScript(plugin.url);
    }));
}