import miniToastr from 'mini-toastr';
import { loader } from './loader';


const fetchProgress = (url, opts={}) => {
    return new Promise( (res, rej)=>{
        var xhr = new XMLHttpRequest();
        xhr.open(opts.method || 'get', url);
        for (var k in opts.headers||{})
            xhr.setRequestHeader(k, opts.headers[k]);
        xhr.onload = e => res(e.target.responseText);
        xhr.onerror = rej;
        if (xhr.upload && opts.onProgress)
            xhr.upload.onprogress = opts.onProgress; // event.loaded / event.total * 100 ; //event.lengthComputable
        xhr.send(opts.body);
    });
}

export const storeFile = async (filename, data, onProgress) => {
    loader.show();
    const file = data ? new File([new Blob([data])], filename) : filename;
    const fileName = data ? filename : file.name;
    
    return await fetchProgress(`/upload/${fileName}`, {
        method: 'post',
        body: file,
    }, onProgress).then(() => {
        loader.hide();
        miniToastr.success('Successfully saved to flash!', '', 5000);
    }, e => {
        loader.hide();
        miniToastr.error(e.message, '', 5000);
    });
}

export const deleteFile = async (filename) => {    
    return await fetch('/delete/'+filename, { method: 'POST' }).then(() => {
        miniToastr.success('Successfully saved to flash!', '', 5000);
    }, e => {
        miniToastr.error(e.message, '', 5000);
    });
}

export const loadDevices = async (url) => {
    return fetch(`${url}/plugin_state/`).then(response => response.json()); //.then(response => response.Sensors);
}