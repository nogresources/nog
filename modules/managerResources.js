const _config = require('../config.json');
const fs = require('fs');
const path = require('path');

const pathFileStorage = `${__dirname}/../nog.json`;

module.exports = {
    storage: async (_resource, _version, _installPath = null, _token = null) => {
        return new Promise((resolve, reject) => { 
            var data = [];
            if (!fs.existsSync(pathFileStorage)) {
                var file = fs.createWriteStream(pathFileStorage);
                file.close();
            }
    
            fs.readFile(pathFileStorage, 'utf8', (err, fileData) => {
                if (err)  return console.error(err);
                   
                if (fileData != '') data = JSON.parse(fileData);
    
                pos = data.map(function(e) { return e.name }).indexOf(_resource.name);
                
                if (pos == -1) {
                    data.push({
                        name: _resource.name,
                        version: _version,
                        path: _installPath,
                        token: _token,
                    });
                } else {
                    data[pos].version = _version;
                    data[pos].path = _installPath;
                    data[pos].token = _token;
                }
    
                fs.writeFile(pathFileStorage, JSON.stringify(data), err => {
                    if (err) {
                        console.error(err);
                    }
    
                    return resolve(true);
                });
            });
        })
        
    }
}