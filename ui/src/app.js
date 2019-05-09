import { h, render, Component } from 'preact';
import miniToastr from 'mini-toastr';
import { pins } from './lib/pins';
import { Menu } from './components/menu';
import { Page } from './components/page';
import { loadConfig } from './lib/config';
import { settings } from './lib/settings';
import { loader } from './lib/loader';
import { loadPlugins, firePageLoad } from './lib/plugins';
import { menu } from './lib/menu';

miniToastr.init({})

const clearSlashes = path => {
    return path.toString().replace(/\/$/, '').replace(/^\//, '');
};

const getFragment = () => {
    const match = window.location.href.match(/#(.*)$/);
    const fragment = match ? match[1] : '';
    return clearSlashes(fragment);
};

class App extends Component {
    constructor() {
        super();
        this.state = {
            menuActive: false,
            menu: menu.menus[0],
            page:  menu.menus[0],
            changed: false,
        }

        this.menuToggle = () => {
            this.setState({ menuActive: !this.state.menuActive });
        }
    }

    getBreadcrumbs(page) {
        if (!page) return (null);

        return (<li><a href={`#${page.href}`}>{page.pagetitle == null ? page.title : page.pagetitle}</a></li>)
    }

    render(props, state) {
        
        const params = getFragment().split('/').slice(2);
        const active = this.state.menuActive ? 'active' : '';
        return (
            <div id="layout1" class={active}>
                <nav class="navbar is-link is-fixed-top" role="navigation" aria-label="main navigation">
                    <div class="navbar-brand" style="width: 250px;">
                        <a class="navbar-item" href="https://bulma.io">
                            <b>SH</b>TECH-<b>R</b>
                        </a>
                        <div class="navbar-burger burger" data-target="navbarExampleTransparentExample">
                        <span></span>
                        <span></span>
                        <span></span>
                        </div>
                    </div>
                    <div id="navbarBasicExample" class="navbar-menu">
                        <div class="navbar-start">
                            <nav class="breadcrumb has-succeeds-separator navbar-item" aria-label="breadcrumbs">
                                >&nbsp; <ul>
                                    {this.getBreadcrumbs(state.page.parent)}
                                    {this.getBreadcrumbs(state.page)}
                                </ul>
                            </nav>
                        </div>
                        <div class="navbar-end">
                        { state.changed ? (
                            <a class="navbar-item" href="#tools/diff">CHANGED! Click here to SAVE</a>
                        ) : (null) }
                        </div>
                    </div>
                </nav>
                
                <section style="display: flex; margin-top: 52px;">
                    <div style="flex: 0 0 250px">
                        <Menu menus={menu.menus} selected={state.menu} />
                    </div>
                    <div style="flex: 1">
                    <Page page={state.page} params={params} changed={this.state.changed} />
                    </div>
                </section>
                

            </div>
        );
    }

    componentDidUpdate() {
        this.onPageLoad();
    }

    componentDidMount() {
        loader.hide();

        let current = '';
        const fn = () => {
            const newFragment = getFragment();
            const diff = settings.diff();
            const editorDiff = settings.editor.diff();
            if(this.state.changed !== (!!diff.length || !!editorDiff.length)) {
                this.setState({changed: !this.state.changed})
            }
            if(current !== newFragment) {
                current = newFragment;
                const parts = current.split('/');
                const m = menu.menus.find(menu => menu.href === parts[0]);
                const page = parts.length > 1 ? menu.routes.find(route => route.href === `${parts[0]}/${parts[1]}`) : m;
                if (page) {
                    this.setState({ page, menu: m, menuActive: false });
                }
            }
        }
        this.interval = setInterval(fn, 100);

        this.onPageLoad();
    }

    onPageLoad() {
        window.requestAnimationFrame(() => {
            firePageLoad(); 
        });
    }

    componentWillUnmount() {}
}

const load = async () => {
    await loadConfig();
    await loadPlugins();
    render(<App />, document.body);
}

load();

console.log(document.location);