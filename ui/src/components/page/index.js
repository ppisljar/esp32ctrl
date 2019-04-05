import { h, Component } from 'preact';

export class Page extends Component {
    getBreadcrumbs(page) {
        if (!page) return (null);

        return (<span> > <a href={`#${page.href}`}>{page.pagetitle == null ? page.title : page.pagetitle}</a></span>)
    }

    render(props) {
        const PageComponent = props.page.component;

        return (
        <div id="main">
            <div class="header">
                {this.getBreadcrumbs(props.page.parent)} > {props.page.pagetitle == null ? props.page.title : props.page.pagetitle}
                { props.changed ? (
                    <a style="float: right" href="#tools/diff">CHANGED! Click here to SAVE</a>
                ) : (null) }
            </div>

            <div class={`content ${props.page.class}`}>
                <PageComponent params={props.params} />
            </div>
        </div>
        );
    }
}