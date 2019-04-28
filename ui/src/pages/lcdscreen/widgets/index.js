import { Label, labelEditorConfig } from "./label";
import { Image } from "./image";
import { Slider, sliderEditorConfig } from "./slider";
import { Button, buttonEditorConfig } from "./button";
import { Box, boxEditorConfig } from "./box";
import { valueEditorConfig, Value } from "./value";
import { WidgetComponent } from './widget_component';
import { settings } from "../../../lib/settings";

export const widgets = [
    { name: 'label', title: 'label', component: Label, editorConfig: labelEditorConfig },
    { name: 'image', title: 'image', component: Image },
    { name: 'button', title: 'button', component: Button, editorConfig: buttonEditorConfig },
    { name: 'slider', title: 'slider', component: Slider, editorConfig: sliderEditorConfig },
    { name: 'box', title: 'box', component: Box, editorConfig: boxEditorConfig },
    { name: 'value', title: 'value', component: Value, editorConfig: valueEditorConfig },
]

export const getWidgets = () => {
    return [
        ...widgets,
        ...settings.get('lcd.widgets', []).map(widget => ({
            name: widget.idx,
            title: widget.name,
            component: WidgetComponent,
        }))
    ]
}