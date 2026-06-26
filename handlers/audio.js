const Alexa = require('ask-sdk-core');
const { AUDIO_DATA, RADIO_NAME, RADIO_SLOGAN } = require('../config');
const { fetchNowPlaying } = require('../api');

const PlayAudioIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'PlayStreamIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.ResumeIntent');
    },
    async handle(handlerInput) {
        try {
            const data = await fetchNowPlaying();
            return handlerInput.responseBuilder
                .speak(`Sintonizando ${data.programa} en ${RADIO_NAME}`)
                .addAudioPlayerPlayDirective('REPLACE_ALL', AUDIO_DATA.url, AUDIO_DATA.token, 0, null, AUDIO_DATA.metadata)
                .withStandardCard(RADIO_NAME, `Sintonizando ${data.programa}`, AUDIO_DATA.metadata.art.sources[0].url)
                .getResponse();
        } catch {
            return handlerInput.responseBuilder
                .speak(`Sintonizando ${RADIO_NAME}`)
                .addAudioPlayerPlayDirective('REPLACE_ALL', AUDIO_DATA.url, AUDIO_DATA.token, 0, null, AUDIO_DATA.metadata)
                .withStandardCard(RADIO_NAME, RADIO_SLOGAN, AUDIO_DATA.metadata.art.sources[0].url)
                .getResponse();
        }
    },
};

const PlaybackStoppedIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'AudioPlayer.PlaybackStopped';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .addAudioPlayerClearQueueDirective('CLEAR_ALL')
            .addAudioPlayerStopDirective()
            .getResponse();
    },
};

const PlaybackStartedIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'AudioPlayer.PlaybackStarted';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .addAudioPlayerClearQueueDirective('CLEAR_ENQUEUED')
            .getResponse();
    },
};

module.exports = { PlayAudioIntentHandler, PlaybackStoppedIntentHandler, PlaybackStartedIntentHandler };
