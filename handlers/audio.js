const Alexa = require('ask-sdk-core');
const { AUDIO_DATA, RADIO_NAME, RADIO_SLOGAN } = require('../config');
const { fetchNowPlaying } = require('../api');
const { supportsAPL, buildAPLDirective } = require('../utils');

const PlayAudioIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'PlayStreamIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.ResumeIntent');
    },
    async handle(handlerInput) {
        const useAPL = supportsAPL(handlerInput);
        const logo = AUDIO_DATA.metadata.art.sources[0].url;
        const bg = AUDIO_DATA.metadata.backgroundImage.sources[0].url;

        try {
            const data = await fetchNowPlaying();
            const builder = handlerInput.responseBuilder
                .speak(`Sintonizando ${data.programa} en ${RADIO_NAME}`)
                .addAudioPlayerPlayDirective('REPLACE_ALL', AUDIO_DATA.url, AUDIO_DATA.token, 0, null, AUDIO_DATA.metadata);

            if (useAPL) {
                builder.addDirective(buildAPLDirective({
                    logo, background: bg,
                    stationName: RADIO_NAME, stationSlogan: RADIO_SLOGAN,
                    program: data.programa, production: data.produccion,
                    ptn: data.ptn || '', isLive: true
                }));
            } else {
                builder.withStandardCard(RADIO_NAME, `Sintonizando ${data.programa}`, logo);
            }

            return builder.getResponse();
        } catch {
            const builder = handlerInput.responseBuilder
                .speak(`Sintonizando ${RADIO_NAME}`)
                .addAudioPlayerPlayDirective('REPLACE_ALL', AUDIO_DATA.url, AUDIO_DATA.token, 0, null, AUDIO_DATA.metadata);

            if (useAPL) {
                builder.addDirective(buildAPLDirective({
                    logo, background: bg,
                    stationName: RADIO_NAME, stationSlogan: RADIO_SLOGAN,
                    program: RADIO_NAME, production: RADIO_SLOGAN,
                    ptn: '', isLive: true
                }));
            } else {
                builder.withStandardCard(RADIO_NAME, RADIO_SLOGAN, logo);
            }

            return builder.getResponse();
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
