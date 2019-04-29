import { Component, h } from "preact";
import { Widget } from "./widget";

 export const generateWidgetComponent = (node) => {
    return class WidgetComponent extends Widget {
        constructor(props) {
            super(props);
            this.node = node;
        }

        renderComponent() {
            return (<span>{node.getText(this.props.item)}</span>)
        }
    }
 }

export function toByteArray(x, n) {
    var hexString = x.toString(16);
    if(hexString.length % 2 > 0) hexString = "0" + hexString;
    var byteArray = [];
    for(var i = 0; i < hexString.length; i += 2) {
        byteArray.push(parseInt(hexString.slice(i, i + 2), 16));
    }
    while (byteArray.length < n) byteArray = [0, ...byteArray];
    return byteArray;
}

export const getString = (bytes) => {
    let res = '';
    for (let i = bytes.length - 1; i >= 0; i--) {
        res += String.fromCharCode(bytes[i]);
    }
    return res;
};