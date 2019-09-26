import miniToastr from 'mini-toastr';
import { loader } from './loader';


export const fetchProgress = (url, opts={}) => {
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

export const fetchWithTimeout = (url, params) => {
    const FETCH_TIMEOUT = 5000;
    let didTimeOut = false;

    return new Promise(function(resolve, reject) {
        const timeout = setTimeout(function() {
            didTimeOut = true;
            reject(new Error('Request timed out'));
        }, FETCH_TIMEOUT);

        fetch(url, params)
            .then(function(response) {
                // Clear the timeout as cleanup
                clearTimeout(timeout);
                if(!didTimeOut) {
                    console.log('fetch good! ', response);
                    resolve(response);
                }
            })
            .catch(function(err) {
                console.log('fetch failed! ', err);

                // Rejection already happened with setTimeout
                if(didTimeOut) return;
                // Reject with error
                reject(err);
            });
    })
        .then(function() {
            // Request success and no timeout
            console.log('good promise, no timeout! ');
        })
        .catch(function(err) {
            // Error: response error, request timeout or runtime error
            console.log('promise error! ', err);
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
    return fetch(`${url || ''}/plugin_state/`).then(response => response.json()); //.then(response => response.Sensors);
}

export default { fetchProgress, storeFile, deleteFile, loadDevices };