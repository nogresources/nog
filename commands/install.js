const mirror = require('../modules/mirror');

module.exports = async function (_Nog, resource, options = null) { 
    let test = await mirror.resource(_Nog.getMirror(), resource);
    console.log('cmd install', test);
    let download = await mirror.download(_Nog.getPath(), _Nog.getMirror(), resource);
};