const AUDIO_DATA = {
    token: 'stream-radio-uas',
    url: 'https://stream.radiouas.org/?format=mp3&ref=RadioUASSkill',
    metadata: {
        title: 'Radio UAS',
        subtitle: 'Frecuencia de la cultura viva',
        art: {
            sources: [
                {
                    contentDescription: 'Radio UAS Logo',
                    url: 'https://spc.radiouas.org/img/alexa/skill.png',
                    widthPixels: 512,
                    heightPixels: 512
                }
            ]
        },
        backgroundImage: {
            sources: [
                {
                    contentDescription: 'Radio UAS Background',
                    url: 'https://spc.radiouas.org/img/alexa/bg.jpg',
                    widthPixels: 1920,
                    heightPixels: 1280
                }
            ]
        }
    }
};

const VIDEO_DATA = {
    url: 'https://stream.radiouas.org/?format=hls&ref=RadioUASSkill',
    title: 'Radio UAS TV',
    subtitle: 'Señal en vivo'
};

const SCHEDULE_DAILY_API = 'https://spc.radiouas.org/api/schedule/daily';

const NOW_PLAYING_API = 'https://spc.radiouas.org/api/schedule/now?format=json';

const TIMEZONE_OFFSET_MINUTES = -420;

const RADIO_NAME = 'Radio UAS';

const RADIO_SLOGAN = 'Frecuencia de la cultura viva';

const DEFAULT_ICON = 'ic_music';

const SLUG_ICONS = {
    music: 'ic_music',
    journal: 'ic_news',
    news: 'ic_announcement',
    podcast: 'ic_microphone',
    magazine: 'ic_media',
    entertainment: 'ic_play_trailer',
    academic: 'ic_library',
    science: 'ic_remember_this',
    health: 'ic_sport_meditation',
    sports: 'ic_sports',
    children: 'ic_game',
    culture: 'ic_image',
    women: 'ic_favorite',
    youth: 'ic_profile'
};

const SLUG_LABELS = {
    music: 'Música',
    journal: 'Periodismo',
    news: 'Noticias',
    podcast: 'Podcast',
    magazine: 'Revista',
    entertainment: 'Entretenimiento',
    academic: 'Academia',
    science: 'Ciencia',
    health: 'Salud',
    sports: 'Deportes',
    children: 'Infantil',
    culture: 'Cultura',
    women: 'Mujer',
    youth: 'Juventud'
};

const FALLBACK_PROGRAM = {
    name: 'Paisajes sonoros',
    producer: 'Selecciones de la Fonoteca',
    host: 'Selecciones de la Fonoteca',
    image: 'https://assets.radiouas.org/covers/programme-cover-99.jpeg',
    slug: 'music'
};

module.exports = {
    AUDIO_DATA,
    VIDEO_DATA,
    SCHEDULE_DAILY_API,
    NOW_PLAYING_API,
    TIMEZONE_OFFSET_MINUTES,
    RADIO_NAME,
    RADIO_SLOGAN,
    DEFAULT_ICON,
    SLUG_ICONS,
    SLUG_LABELS,
    FALLBACK_PROGRAM
};
