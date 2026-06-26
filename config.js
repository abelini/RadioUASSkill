const AUDIO_DATA = {
    token: 'stream-radio-uas',
    url: 'https://stream.radiouas.org/?format=mp3&ref=RadioUASSkill',
    metadata: {
        title: 'Radio UAS',
        subtitle: 'Frecuencia de la cultura viva',
        art: {
            sources: [
                { contentDescription: 'Radio UAS Logo', url: 'https://spc.radiouas.org/img/alexa/skill.png', widthPixels: 512, heightPixels: 512 }
            ]
        },
        backgroundImage: {
            sources: [
                { contentDescription: 'Radio UAS Background', url: 'https://spc.radiouas.org/img/alexa/bg.jpg', widthPixels: 1920, heightPixels: 1280 }
            ]
        }
    }
};

const VIDEO_DATA = {
    url: 'https://stream.radiouas.org/?format=hls&ref=RadioUASSkill',
    title: 'Radio UAS TV',
    subtitle: 'Señal en vivo'
};

const NOW_PLAYING_API = 'https://spc.radiouas.org/api/schedule/now?format=json';
const RADIO_NAME = 'Radio UAS';
const RADIO_SLOGAN = 'Frecuencia de la cultura viva';

module.exports = { AUDIO_DATA, VIDEO_DATA, NOW_PLAYING_API, RADIO_NAME, RADIO_SLOGAN };
