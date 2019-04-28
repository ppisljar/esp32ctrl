import { h, Component } from 'preact';

import { DragDropContext } from 'preact-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Toolbox } from './toolbox';
import { Page } from './page';


export class LcdScreenComponent extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            grid: 1,
        }
    }

    render(props) {
        

        return (
                <div>
                    <Toolbox />
                    grid: <select value={this.state.grid} onChange={(e) => { this.setState({ grid: e.currentTarget.value }) }}>
                        <option value="1">1px</option>
                        <option value="5">5px</option>
                        <option value="10">10px</option>
                        <option value="15">15px</option>
                        <option value="20">20px</option>
                        <option value="30">30px</option>
                        <option value="50">50px</option>
                    </select>
                    <Page page={props.page} widget={props.widget} grid={this.state.grid} />
                    
                </div>
        );
    }
}

export const LcdScreen = DragDropContext(HTML5Backend)(LcdScreenComponent);

