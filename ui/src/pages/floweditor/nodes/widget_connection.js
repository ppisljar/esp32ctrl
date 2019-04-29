import { Component, h } from "preact";

export class WidgetConnection extends Component {
    constructor(props) {
        super(props);
    }

    setPath(x1, y1, x2, y2, tension = 0.5) {
        const delta = (x2-x1)*tension;
        const hx1=x1+delta;
        const hy1=y1;
        const hx2=x2-delta;
        const hy2=y2;
        
        const path = `M ${x1} ${y1} C ${hx1} ${hy1} ${hx2} ${hy2} ${x2} ${y2}`;
        return path;
    }

    render() {
        const style = {
            'z-index': '-1',
            position: 'absolute',
            top: '0',
            left: '0',
        };

        const { fill, color } = this.props;

        

        const path = this.setPath(this.props.from[0],
                                    this.props.from[1],
                                    this.props.to[0],
                                    this.props.to[1]);
        return (
            <svg width="100%" height="100%" style={style}>
                <path fill={fill} stroke={color} d={path} />
            </svg>
        );
    }
}