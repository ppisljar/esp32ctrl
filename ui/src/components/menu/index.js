import { h, Component } from 'preact';
import { settings } from '../../lib/settings';

export class Menu extends Component {
    renderMenuChildren(menu) {
        return [...menu.children.map(child => {
            if (child.action) {
                return (
                <li>
                    <a href={`#${child.href}`} onClick={child.action}>{child.title}</a>
                </li>  
                )
            }
            return (<li>
                <a href={`#${child.href}`}>{child.title}</a>
            </li>);
        })];
    }
    renderMenuItem(menu) {
        if (menu.adminOnly && settings.userName !== 'admin') return (null);
        if (menu.action) {
            return (
            <li>
                <a href={`#${menu.href}`} onClick={menu.action}>{menu.title}</a>
            </li>  
            )
        }
        if (menu.href === this.props.selected.href) {
            return [
                (<li>
                    <a href={`#${menu.href}`} class="is-active">{menu.title}</a>
                    <ul>{this.renderMenuChildren(menu)}</ul>
                </li>),
            ]
        }
        return (<li class="pure-menu-item">
            <a href={`#${menu.href}`} class="pure-menu-link">{menu.title}</a>
        </li>);
    }

    render(props) {
        if (props.open === false) return;
    
        return (
        <div id="menu">
            <div class="menu">
                <a class="pure-menu-heading" href="/"><b>ESP</b>Easy</a>
                <ul class="menu-list">
                    {props.menus.map(menu => (this.renderMenuItem(menu)))}
                </ul>
            </div>
        </div>
        );
    }
}