const Alexa = require('ask-sdk-core');
const { AUDIO_DATA, VIDEO_DATA } = require('../config');
const { supportsVideo } = require('../utils');

const PlayVideoIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'PlayVideoIntent';
    },
    handle(handlerInput) {
        if (supportsVideo(handlerInput)) {
            return handlerInput.responseBuilder
                .speak('Sintonizando Radio UAS TV')
                .addVideoAppLaunchDirective(VIDEO_DATA.url, VIDEO_DATA.title, VIDEO_DATA.subtitle)
                .getResponse();
        } else {
            return handlerInput.responseBuilder
                .speak("Este dispositivo no puede reproducir video. Pondré la radio en su lugar.")
                .addAudioPlayerPlayDirective('REPLACE_ALL', AUDIO_DATA.url, AUDIO_DATA.token, 0, null, AUDIO_DATA.metadata)
                .getResponse();
        }
    },
};

module.exports = { PlayVideoIntentHandler };
