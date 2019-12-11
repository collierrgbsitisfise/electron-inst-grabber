const fs = require('fs');
const request = require('request');

module.exports = (url, path, fileName) => {
    return new Promise((resolve, reject) => {
        console.log('INSIDE');
        request.head(url, function(err, res, body) {
            console.log('content-type:', res.headers['content-type']);
            console.log('content-length:', res.headers['content-length']);
        
            request(url).pipe(fs.createWriteStream(`${path}/${fileName}.jpg`))
                .on('close', () => {
                    resolve(`${path}/${fileName}.jpg`);
                })
                .on('error', (e) => {
                    console.log('error');
                    console.log(e);
                    reject(e);
                });
        });
    });
};
