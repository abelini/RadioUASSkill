const Alexa = require('ask-sdk-core');
const { AUDIO_DATA, RADIO_NAME, RADIO_SLOGAN } = require('../config');
const { fetchScheduleSnapshot } = require('../api');
const { supportsAPL, buildAPLDirective } = require('../utils');

function buildMetadata(now) {
    const fallbackArt = AUDIO_DATA.metadata.art.sources[0].url;
    return {
        ...AUDIO_DATA.metadata,
        title: now.name,
        subtitle: now.producer || RADIO_SLOGAN,
        art: {
            sources: [
                {
                    contentDescription: now.name,
                    url: now.image || fallbackArt,
                    widthPixels: 512,
                    heightPixels: 512
                }
            ]
        }
    };
}

function addVisuals(builder, handlerInput, data) {
    if (!supportsAPL(handlerInput)) {
        builder.withStandardCard(RADIO_NAME, data.now.name, data.now.image || AUDIO_DATA.metadata.art.sources[0].url);
        return;
    }

    builder.addDirective(buildAPLDirective({
        logo: AUDIO_DATA.metadata.art.sources[0].url,
        background: AUDIO_DATA.metadata.backgroundImage.sources[0].url,
        stationName: RADIO_NAME,
        stationSlogan: RADIO_SLOGAN,
        isLive: true,
        ...data
    }));
}

async function visualDirective(handlerInput, playing) {
    if (!supportsAPL(handlerInput)) {
        return null;
    }

    const { now, upNext, online, errorText } = await fetchScheduleSnapshot();

    return buildAPLDirective({
        logo: AUDIO_DATA.metadata.art.sources[0].url,
        background: AUDIO_DATA.metadata.backgroundImage.sources[0].url,
        stationName: RADIO_NAME,
        stationSlogan: RADIO_SLOGAN,
        isLive: true,
        now, upNext, online, errorText, playing
    });
}

async function buildRadioResponse(handlerInput) {
    const { now, upNext, online, errorText } = await fetchScheduleSnapshot();

    const builder = handlerInput.responseBuilder
        .speak(`Sintonizando ${now.name} en ${RADIO_NAME}`)
        .addAudioPlayerPlayDirective('REPLACE_ALL', AUDIO_DATA.url, AUDIO_DATA.token, 0, null, buildMetadata(now));

    addVisuals(builder, handlerInput, { now, upNext, online, errorText, playing: true });

    return builder.getResponse();
}

async function buildStopRadioResponse(handlerInput) {
    const { now, upNext, online, errorText } = await fetchScheduleSnapshot();

    const builder = handlerInput.responseBuilder
        .speak('Pausando la transmisión.')
        .addAudioPlayerClearQueueDirective('CLEAR_ALL')
        .addAudioPlayerStopDirective();

    addVisuals(builder, handlerInput, { now, upNext, online, errorText, playing: false });

    return builder.getResponse();
}

const PlayAudioIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'PlayStreamIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.ResumeIntent');
    },
    handle: buildRadioResponse,
};

const PlaybackStoppedIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'AudioPlayer.PlaybackStopped';
    },
    async handle(handlerInput) {
        const builder = handlerInput.responseBuilder
            .addAudioPlayerClearQueueDirective('CLEAR_ALL')
            .addAudioPlayerStopDirective();

        const directive = await visualDirective(handlerInput, false);
        if (directive) {
            builder.addDirective(directive);
        }

        return builder.getResponse();
    },
};

const PlaybackStartedIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'AudioPlayer.PlaybackStarted';
    },
    async handle(handlerInput) {
        const builder = handlerInput.responseBuilder
            .addAudioPlayerClearQueueDirective('CLEAR_ENQUEUED');

        const directive = await visualDirective(handlerInput, true);
        if (directive) {
            builder.addDirective(directive);
        }

        return builder.getResponse();
    },
};

module.exports = {
    PlayAudioIntentHandler,
    PlaybackStoppedIntentHandler,
    PlaybackStartedIntentHandler,
    buildRadioResponse,
    buildStopRadioResponse
};
