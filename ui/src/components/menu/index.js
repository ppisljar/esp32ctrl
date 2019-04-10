import { h, Component } from 'preact';
import { settings } from '../../lib/settings';

export class Menu extends Component {
    renderMenuChildren(menu) {
        if (!menu.children.length) return (null);
        return (<ul>{[...menu.children.map(child => {
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
        })]}</ul>);
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
                    {this.renderMenuChildren(menu)}
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
        <aside class="menu">
            <ul class="menu-list">
                {props.menus.map(menu => (this.renderMenuItem(menu)))}
            </ul>
        </aside>
        );
    }
}