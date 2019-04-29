import { h, Component } from 'preact';
import { settings } from '../lib/settings';
import { saveConfig } from '../lib/config';
import { loader } from '../lib/loader';


export class DiffPage extends Component {
    constructor(props) {
        super(props);

        this.diff = settings.diff();
        this.editorDiff = settings.editor.diff();

        this.applyChanges = () => {
            this.diff.map(d => {
                const input = this.form.elements[d.path];
                if (!input.checked) {
                    settings.set(input.name, d.val1);
                }
            });
            settings.apply();

            this.editorDiff.map(d => {
                const input = this.form.elements[d.path];
                if (!input.checked) {
                    settings.editor.set(input.name, d.val1);
                }
            });
            settings.editor.apply();
            
            loader.show();
            saveConfig().then(() => {
                window.location.href='#config/reboot';
            });
            
        };
    }
    

    render(props) {
        return (
            <div>
                <form ref={ref => this.form = ref}>
                    {this.diff.map(change => {
                        return (
                            <div>
                                <b>{change.path}</b>: before: <b>{JSON.stringify(change.val1)}</b> now:<b>{JSON.stringify(change.val2)}</b> <input name={change.path} type='checkbox' defaultChecked={true} />
                            </div>
                        )
                    })}

                    {this.editorDiff.map(change => {
                        return (
                            <div>
                                <b>{change.path}</b>: before: <b>{JSON.stringify(change.val1)}</b> now:<b>{JSON.stringify(change.val2)}</b> <input name={change.path} type='checkbox' defaultChecked={true} />
                            </div>
                        )
                    })}
                    <button type="button" onClick={this.applyChanges}>APPLY</button>
                </form>
            </div>
            
        );
    }
}