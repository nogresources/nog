const mirror = require('../modules/mirror');
const _Manager = require('../modules/managerResources');

function cleanInstall() {

}

module.exports = async function (_Nog, _resource = null, _options = null) {
    if (_resource == null) {

    } else {
        // instala 1 pacote só
        let response = await mirror.resource(_Nog.getMirror(), _resource);

        if (response.success == 'true' || response.success === true) {
            let resource = response.data;
            let subPath = _options['path'] || '';
            let _token = _options['token'] || '';
            let _version = _options['version'] || resource.current_version.version;
            let pathInstall = _Nog.getPath() + subPath + resource.name;
            let url = _Nog.getMirror() + '/resource/' + resource.name + '/download?version=' + _version + '&token=' + _token;

            console.log(`Starting download: (${resource.name}) ${resource.title} ${_version}`);
            let download = await mirror.download(url, pathInstall, resource, _version);
            console.log('download complete', download);

            if (download.success == 'true' || download.success === true) {
                let responseStorage = await _Manager.storage(resource, _version, pathInstall, _token);
                if (responseStorage) {

                }
                console.log('aaaaa', responseStorage)
            } else {
                return console.log('Download failed')
            }

        } else {
            console.log(`${response.msg}`);
        }
    }

};