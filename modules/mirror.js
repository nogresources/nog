const request = require('request');
const fs = require('fs');
const cliProgress = require('cli-progress');

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
    download: async (path, mirror, _resource, qs = '', optionalFolder = '', _version = null) => {
        const progressbar = new cliProgress.SingleBar({
            format: `NOG: Downloading ${_resource.name}` + ' | {bar} {percentage}% {value}/{total}bytes',
        }, cliProgress.Presets.shades_classic);

        let dir = `${path}/${optionalFolder}${_resource.name}`;
        if (!fs.existsSync(`${dir}`)) {
            fs.mkdirSync(`${dir}`);
        }

        let file = fs.createWriteStream(`${dir}/${_resource.name}.zip`);
        var received_bytes = 0;
        var total_bytes = 0;

        return new Promise((resolve, reject) => {
            request.get('http://portal.pmf.sc.gov.br/arquivos/arquivos/zip/14_04_2011_16.04.09.517c170f3a630ca5a8af2ec1f93ba247.zip')
                .on('error', function (err) {
                    console.log(err);
                }).on('response', function (data) {
                    total_bytes = parseInt(data.headers['content-length']);
                    progressbar.start(total_bytes, 0);
                }).on('data', function (chunk) {
                    received_bytes += chunk.length;
                    var total = total_bytes / 1048576;
                    // console.log(`Downloading ${_resource} ` + (100.0 * received_bytes / total_bytes).toFixed(2) + "% " + (received_bytes / 1048576).toFixed(2) + "/" + total.toFixed(2) + "mb")
                    let progressFil = received_bytes;
                    progressbar.update(progressFil);
                }).pipe(file).on('finish', () => {
                    progressbar.stop();
                    console.log(`The script is finished downloading.`);
                    file.close();
                    resolve(file);
                });
        })





        // await new Promise((resolve, reject) => {
        //     let stream = request({
        //         uri: 'http://i3.ytimg.com/vi/J---aiyznGQ/mqdefault.jpg',
        //         headers: {
        //             'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        //             'Accept-Encoding': 'gzip, deflate, br',
        //             'Accept-Language': 'en-US,en;q=0.9,fr;q=0.8,ro;q=0.7,ru;q=0.6,la;q=0.5,pt;q=0.4,de;q=0.3',
        //             'Cache-Control': 'max-age=0',
        //             'Connection': 'keep-alive',
        //             'Upgrade-Insecure-Requests': '1',
        //             'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
        //         },
        //         gzip: true
        //     })
        //     .pipe(file)
        //     .on('response', function ( data ) {
        //         console.log( data.headers[ 'content-length' ] );
        //     })
        //     .on('data', function ( data ) {
        //         console.log( data.headers[ 'content-length' ] );
        //     })
        //     .on('finish', () => {
        //         console.log(`The file is finished downloading.`);
        //         file.close();
        //         resolve();
        //     })
        //     .on('error', (error) => {
        //         reject(error);
        //     })
        // })
        // .catch(error => {
        //     console.log(`Something happened: ${error}`);
        // });
    }
}