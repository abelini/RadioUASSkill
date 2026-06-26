const Alexa = require('ask-sdk-core');
const aplDocument = require('./apl/main.json');

function supportsVideo(handlerInput) {
    const supportedInterfaces = Alexa.getSupportedInterfaces(handlerInput.requestEnvelope);
    return supportedInterfaces.VideoApp;
}

function supportsAPL(handlerInput) {
    const supportedInterfaces = Alexa.getSupportedInterfaces(handlerInput.requestEnvelope);
    return supportedInterfaces['Alexa.Presentation.APL'];
}

function buildAPLDirective(programData) {
    return {
        type: 'Alexa.Presentation.APL.RenderDocument',
        token: 'apl-radio-uas-skill',
        document: aplDocument,
        datasources: { programData }
    };
}

module.exports = { supportsVideo, supportsAPL, buildAPLDirective };
