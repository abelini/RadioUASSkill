const Alexa = require('ask-sdk-core');
const { AUDIO_DATA, RADIO_NAME, RADIO_SLOGAN } = require('../config');
const { fetchScheduleSnapshot } = require('../api');
const { supportsAPL, buildAPLDirective } = require('../utils');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    async handle(handlerInput) {
        const useAPL = supportsAPL(handlerInput);
        const logo = AUDIO_DATA.metadata.art.sources[0].url;
        const bg = AUDIO_DATA.metadata.backgroundImage.sources[0].url;

        const { now, upNext, online, errorText } = await fetchScheduleSnapshot();
        const next = upNext[0] && upNext[0].name !== now.name ? upNext[0].name : null;

        const builder = handlerInput.responseBuilder
            .speak(next
                ? `Bienvenido a ${RADIO_NAME}. Ahora suena ${now.name}. A continuación, ${next}. ¿Quieres escuchar la radio o ver la transmisión de video?`
                : `Bienvenido a ${RADIO_NAME}. Ahora suena ${now.name}. ¿Quieres escuchar la radio o ver la transmisión de video?`)
            .reprompt('Puedes decirme: pon la radio, o, pon el video.');

        if (useAPL) {
            builder.addDirective(buildAPLDirective({
                logo, background: bg,
                stationName: RADIO_NAME, stationSlogan: RADIO_SLOGAN,
                now, upNext, isLive: true, online, errorText, playing: false
            }));
        } else {
            builder.withStandardCard(RADIO_NAME, `Ahora suena ${now.name}`, now.image || logo);
        }

        return builder.getResponse();
    },
};

module.exports = { LaunchRequestHandler };
