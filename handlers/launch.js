const Alexa = require('ask-sdk-core');
const { AUDIO_DATA, RADIO_NAME, RADIO_SLOGAN } = require('../config');
const { fetchNowPlaying } = require('../api');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    async handle(handlerInput) {
        try {
            const data = await fetchNowPlaying();
            return handlerInput.responseBuilder
                .speak(`Bienvenido a ${RADIO_NAME}. Ahora suena ${data.programa}. ¿Quieres escuchar la radio o ver la transmisión de video?`)
                .reprompt('Puedes decirme: pon la radio, o, pon el video.')
                .withStandardCard(RADIO_NAME, `Ahora suena ${data.programa}`, AUDIO_DATA.metadata.art.sources[0].url)
                .getResponse();
        } catch {
            return handlerInput.responseBuilder
                .speak(`Bienvenido a ${RADIO_NAME}. ¿Quieres escuchar la radio o ver la transmisión de video?`)
                .reprompt('Puedes decirme: pon la radio, o, pon el video.')
                .withStandardCard(RADIO_NAME, RADIO_SLOGAN, AUDIO_DATA.metadata.art.sources[0].url)
                .getResponse();
        }
    },
};

module.exports = { LaunchRequestHandler };
