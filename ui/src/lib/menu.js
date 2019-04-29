import { 
    ConfigPage, 
    DevicesPage, 
    DevicesEditPage, 
    ControllersPage, 
    ControllerEditPage, 
    ConfigAdvancedPage, 
    ConfigHardwarePage, 
    RebootPage, 
    LoadPage, 
    RulesPage, 
    UpdatePage, 
    ToolsPage, 
    FSPage, 
    FactoryResetPage, 
    DiscoverPage, 
    DiffPage, 
    RulesEditorPage, 
    SetupPage,
    SysVarsPage,
    ControllerAlexaPage,
    ControllerAlertsPage,
    AlertsPage,
    AlertsEditPage,
    ConfigPluginsPage,
    ConfigBluetoothPage,
    ConfigLCDPage,
    ConfigLCDScreenPage,
    ConfigLCDWidgetPage,
    RulesEditor1Page,
} from '../pages';

import { deleteFile } from './espeasy';
import { DashboardPage } from '../pages/dashboard';

const saveConfig = () => {
    window.location.href='/config.json';
}
class Menus {
    constructor() {
        this.menus = [];
        this.routes = [];

        this.addMenu = (menu) => {
            this.menus.push(menu);
            this.addRoute(menu);
        }

        this.addRoute = (route) => {
            this.routes.push(route);
            if (route.children) {
                route.children.forEach(child => {
                    child.parent = route;
                    this.routes.push(child);
                });
            }
        }
    }
    
}

const menus = [
    { title: 'Dashboard', href: 'dashboard', component: DashboardPage, children: [] },
    { title: 'Devices', href: 'devices', component: DevicesPage, children: [] },
    //{ title: 'Controllers', href: 'controllers', component: ControllersPage, children: [] },
    //{ title: 'Automation', href: 'rules', component: RulesEditorPage, class: 'full', children: [] },
    { title: 'Automation', href: 'rules', component: RulesEditor1Page, class: 'full', children: [] },
    { title: 'Alexa', href: 'alexa', component: ControllerAlexaPage, children: [] },
    { title: 'Alerts', href: 'alerts', component: AlertsPage, children: [] },
    { title: 'Config', adminOnly: true, href: 'config', component: ConfigPage, children: [
        { title: 'Hardware', pagetitle: 'Hardware', href: 'config/hardware', component: ConfigHardwarePage },
        { title: 'LCD', pagetitle: 'LCD', href: 'config/lcd', component: ConfigLCDPage },
        { title: 'Bluetooth', pagetitle: 'Bluetooth', href: 'config/bluetooth', component: ConfigBluetoothPage },
        { title: 'Advanced', href: 'config/advanced', component: ConfigAdvancedPage },
        { title: 'Plugins', href: 'config/plugins', component: ConfigPluginsPage },
        { title: 'Save', href: 'config/save', action: saveConfig },
        { title: 'Load', href: 'config/load', component: LoadPage },
        { title: 'Reboot', href: 'config/reboot', component: RebootPage },
        { title: 'Factory Reset', href: 'config/factory', component: FactoryResetPage },
    ] },
    { title: 'Tools', adminOnly: true, href: 'tools', component: ToolsPage, children: [
        { title: 'Discover', href: 'tools/discover', component: DiscoverPage },
        { title: 'Info', href: 'tools/sysinfo', component: SysVarsPage },
        { title: 'Update', href: 'tools/update', component: UpdatePage },
        { title: 'Filesystem', href: 'tools/fs', component: FSPage },
    ] },
];

const routes = [
    { title: 'Edit Controller', href:'controllers/edit', component: ControllerEditPage },
    { title: 'Edit Device', href:'devices/edit', component: DevicesEditPage },
    { title: 'Edit Alert', href:'alerts/edit', component: AlertsEditPage },
    { title: 'Edit Screen', href:'config/lcdscreen', component: ConfigLCDScreenPage },
    { title: 'Edit Widget', href:'config/lcdwidget', component: ConfigLCDWidgetPage },
    { title: 'Save to Flash', href:'tools/diff', component: DiffPage },
    { title: 'Setup', href: 'config/setup', component: SetupPage }
];

const menu = new Menus();
routes.forEach(menu.addRoute);
menus.forEach(menu.addMenu)

export { menu };