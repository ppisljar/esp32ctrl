const pluginAPI = window.getPluginAPI();

pluginAPI.page.appendStyles('https://cdn.jsdelivr.net/npm/bulma-iconpicker@2.1.0/dist/css/bulma-iconpicker.min.css');
pluginAPI.page.appendStyles('https://cdn.materialdesignicons.com/3.5.95/css/materialdesignicons.min.css');
pluginAPI.page.appendScript('https://cdn.jsdelivr.net/npm/bulma-iconpicker@2.1.0/dist/js/bulma-iconpicker.min.js');

pluginAPI.page.onLoad(() => {
    if (!window.bulmaIconpicker) return;
    new window.bulmaIconpicker('.iconpicker');
});