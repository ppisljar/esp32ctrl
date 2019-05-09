import { h, Component } from 'preact';
import { deleteFile, storeFile } from '../lib/esp';
import { loader } from '../lib/loader';

export class FSPage extends Component {
    constructor(props) {
        super(props);
        this.state = { files: [] }

        this.saveForm = async () => {
            loader.show();
            await storeFile(this.file.files[0]);
            await this.fetch();
        }

        this.deleteFile = e => {
            const fileName = e.currentTarget.dataset.name;
            deleteFile(fileName).then(() => (this.fetch()));
        }
    }

    fetch() {
        fetch('/filelist').then(response => response.json()).then(fileList => {
            this.setState({ files: fileList });
        });
    }

    render(props) {
        loader.hide();
        return (
            <div>
                <form class="pure-form pure-form-aligned">
                    <div class="pure-control-group">
                        <label for="file" class="pure-checkbox">
                            File:
                        </label>
                        <input id="file" type="file" ref={ref => this.file = ref} />
                        
                        <button type="button" onClick={this.saveForm}>upload</button>
                    </div>
                </form>
                <table class="pure-table">
                    <thead>
                        <tr>
                            <th>File</th>
                            <th>Size</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.files.map(file => {
                            const url = `/${file.file}`;
                            return (
                        <tr>
                            <td><a href={url}>{file.file}</a></td>
                            <td>{file.size}</td>
                            <td>
                                { file.file === 'config.json' ? (null) :
                                (<button type="button" onClick={this.deleteFile} data-name={file.file}>X</button>)
                                }
                            </td>
                        </tr>
                            ); })}

                    </tbody>
                </table>
            </div>
        );
    }

    componentDidMount() {
        this.fetch();
    }
}