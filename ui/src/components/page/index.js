import { h, Component } from 'preact';

export class Page extends Component {
    render(props) {
        const PageComponent = props.page.component;

        return (
        <div id="main">

            <div class={`content ${props.page.class}`}>
                <PageComponent params={props.params} />
            </div>
        </div>
        );
    }
}