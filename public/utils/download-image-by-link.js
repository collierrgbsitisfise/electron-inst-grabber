const fs = require('fs');
const request = require('request');

module.exports = (url, path, fileName) => {
    return new Promise((resolve, reject) => {
        request.head(url, function(err) {
            if (err) reject(err);

            request(url).pipe(fs.createWriteStream(`${path}/${fileName}.jpg`))
                .on('close', () => {
                    resolve(`${path}/${fileName}.jpg`);
                })
                .on('error', (e) => {
                    reject(e);
                });
        });
    });
};
