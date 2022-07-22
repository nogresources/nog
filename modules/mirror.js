const request = require('request');
const fs = require('fs');
const cliProgress = require('cli-progress');
const _DIR = require('./dir');
const unzipper = require('unzipper');

module.exports = {
    resource: async (mirror, _resource, qs = '') => {
        return new Promise(function (resolve, reject) {
            request(mirror + '/resource/' + _resource + qs, { json: true }, function (error, res, body) {
                if (!error && res.statusCode == 200) {
                    resolve(body);
                } else {
                    reject(error);
                }
            });
        });
    },
    download: async (url, _root, _resource, _version = null) => {
        const progressBar = new cliProgress.SingleBar({
            format: `NOG: Downloading ${_resource.name}` + ' | {bar} {percentage}% {value}/{total} files',
        }, cliProgress.Presets.shades_classic);
    
        if (!fs.existsSync(`${_root}`)) {
            _DIR.mkDirByPathSync(_root);
        }

        var received = 0;
        const archive = await unzipper.Open.url(request, url);
        return new Promise(async (resolve, reject) => {
            progressBar.start(archive.files.length, 0);

            for (const file of archive.files)
            {
                ++received;
                progressBar.update(received);
                if (file.type == 'Directory') {
                    if (!fs.existsSync(`${_root}/${file.path}`)) {
                        await fs.promises.mkdir(`${_root}/${file.path}`);
                    }
                    continue;
                } else {
                    file.stream().pipe(fs.createWriteStream(`${_root}/${file.path}`))
                }

            }

            progressBar.stop();
            console.log(`The script is finished downloading.`);

            resolve({
                success: true
            });
        })
    }
}