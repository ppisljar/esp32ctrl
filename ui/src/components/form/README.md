# Form

Component for easy form creation

props:
- `groups`: object describing configuration groups
- `selected`: current configuration


## groups object

```
{
    group1: { ... },
    group2: { ... },
    group3: { ... },
}
```

## group object

```
{
    name: 'group name as shown to user',
    configs: { ... }
}
```

## configs object

```
{
    config1: {},
    config2: {},
    config3: {},
    config4: [],
}
```

Each property in configs object defines a config id. Its value can be either the config object or an array of config objects.

## config object

Config object has the following properties:
- `name`: config name as shown to user, or a function that returns name
- `type`: conig type, see below for list of config types
- `var`: optional path to store value
- `if`: optional path to value, needs `ifval` defined as well
    or function which should return true/false
- `ifval`: value to compare to if `if` is string 
- `onChange`: function that is called when value changed

Each of the config types can have additional properties defined.

### config types

- `string`: normal text input
- `number`: number input, needs two additional properties: `min` and `max`
- `select`: dropdown selection, needs `options` defined, which can either be an array of options or a function that returns one.
- `gpio`: special dropdown with list of available gpio pins. optionally `pins` function can be defined to filter down the list of pins.
- `ip`: ip input box
- `password`: password input box
- `checkbox`: checkbox input box
- `file`: file input box
- `button`: a button, `value` defines text inside, `click` should be a callback function