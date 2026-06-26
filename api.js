const https = require('https');
const { NOW_PLAYING_API } = require('./config');

function fetchNowPlaying() {
    return new Promise((resolve, reject) => {
        https.get(NOW_PLAYING_API, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

module.exports = { fetchNowPlaying };
