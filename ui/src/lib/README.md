


## settings service

`import { settings } from 'lib/settings'`

settings service
- `settings.get(path)` gets a setting
- `settings.set(path)` sets a setting
- `settings.diff()` gets difference between current and saved settings
- `settings.apply()` apply current settings
- `settings.editor.get(path)` gets editor only setting
- `settings.editor.set(path)` sets editor only setting
- `settings.editor.diff()` gets difference between current and saved editor settings
- `settings.editor.apply()` apply current editor settings
- `settings.events` list of events

## esp service

- `storeFile(filename, data, onProgress)`
- `deleteFile(filename)`

## loader

`import { loader } from 'lib/loader'`

loader singleton to show loading indicator
- `loader.show()` shows loader
- `loader.hide()` hides loader

## menu

menu service and configuration of menu items

## pins

ioPins singleton
- `ioPins.getPins(capabilities)` gives you list of pins with matching capabilities [`digital_in`, `digital_out`, `analog_in`, `analog_out`, `interrupt`, `touch`]

## plugins

plugins service allows you to register additional plugins to UI. A ui_plugin entry to be added to `settings.editor.get('ui_plugins')` with a property `url` which should point to url of the entry script to load.

plugins can access `window.getPluginApi()` method to get access to plugin api. An object is returned:

```
   {
        settings,   // settings service
        loader,     // loader service
        menu,       // menu service
        espeasy,    // esp service
        page,       // page service
    }
```

### page service

page services exposes the following methods:
- `onLoad(callback)` callback to call when page has finished loading
- `appendStyles(url)` to append stylesheets to the document
- `appendScript(url)` to append additional js files to the document


## helpers

- `get()` lodash get
- `set()` lodash set
- `getKeys()`
- `stringToAsciiByteArray(string)`

## config service

should not be used externally.

- `saveConfig(config: bool, editor: bool, rules: bool, alerts: bool)` saves settings (rules saves events.json as well)
- `loadConfig()` loads config.json and editor_config.json events.json, rules and user