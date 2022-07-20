const mirror = require('../modules/mirror');

module.exports = async function (_Nog, _resource, options = null) { 
    let response = await mirror.resource(_Nog.getMirror(), _resource);

    if (response.success == 'true' || response.success === true) {
        let resource = response.data;
        let selectedVersion = options['version'] ? options['version'] : resource.current_version.version;

        console.log(`Iniciando download do script: (${resource.name}) ${resource.title} ${selectedVersion}`);

        let download = await mirror.download(_Nog.getPath(), _Nog.getMirror(), resource, '', '', selectedVersion);

    } else {
        console.log(`(${response.msg}`);
    }
};