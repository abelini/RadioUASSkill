const Alexa = require('ask-sdk-core');
const { AUDIO_DATA, RADIO_NAME, RADIO_SLOGAN } = require('../config');
const { fetchNowPlaying } = require('../api');
const { supportsAPL, buildAPLDirective } = require('../utils');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    async handle(handlerInput) {
        const useAPL = supportsAPL(handlerInput);
        const logo = AUDIO_DATA.metadata.art.sources[0].url;
        const bg = AUDIO_DATA.metadata.backgroundImage.sources[0].url;

        try {
            const data = await fetchNowPlaying();
            const builder = handlerInput.responseBuilder
                .speak(`Bienvenido a ${RADIO_NAME}. Ahora suena ${data.programa}. ¿Quieres escuchar la radio o ver la transmisión de video?`)
                .reprompt('Puedes decirme: pon la radio, o, pon el video.');

            if (useAPL) {
                builder.addDirective(buildAPLDirective({
                    logo, background: bg,
                    stationName: RADIO_NAME, stationSlogan: RADIO_SLOGAN,
                    program: data.programa, production: data.produccion,
                    ptn: data.ptn || '', isLive: true
                }));
            } else {
                builder.withStandardCard(RADIO_NAME, `Ahora suena ${data.programa}`, logo);
            }

            return builder.getResponse();
        } catch {
            const builder = handlerInput.responseBuilder
                .speak(`Bienvenido a ${RADIO_NAME}. ¿Quieres escuchar la radio o ver la transmisión de video?`)
                .reprompt('Puedes decirme: pon la radio, o, pon el video.');

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

module.exports = { LaunchRequestHandler };
