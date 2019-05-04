# rules editor

## code overview
`page.js` gets in a list of devices, list of rules and rule page to render
- it retrieves the list of `available nodes` (`./nodes/index.js`)
- renders the `toolbox`, `drop zone` and `side editor`

`toolbox.js` gets in a list of `available nodes` and renders `toolbox_item` for each of them

`toolbox_item.js` implements a dragsource and renders correct widget for provided `node`

`droppage.js` implements a drop target. In state it holds list of current nodes and connections in the rule page. It handles moving and connecting of nodes.

`controlbox.js` renders the side editor form for selected widget

### nodes

Widget is a node in toolbox that can be dragged to rule page together with definition of its look&feel, editor configuration and conversion to rule.

`widget.js` implements base widget class, which renders node, inputs outputs and handles node dragging.

`widget_input.js`, `widget_output.js` and `widget_connection.js` are implementations of coresponding base widget parts.

`device.js` returns device widgets for all current devices

### widget implementations

in `./nodes/actions`, `./node/logic` and `./node/triggers` there are implementions of all the current widgets.

Each widget should be an object with the following properties:
- `group`: which group widget belongs to (ACTION, LOGIC, TRIGGER)
- `name`: unique id for the widget
- `title`: name shown to the user
- `inputs`: number of inputs to this node
- `outputs`: number of outputs to this node
- `getEditorConfig`: function() that returns editor configuration
- `getEditorComponent`: function() that returns editor component
- `getComponent`: function() that returns node component
- `getText`: function(cfg) that returns text representation of node
- `toDsl`: function(cfg) that returns rule dsl

