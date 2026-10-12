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

function upper(value) {
    return value ? String(value).toUpperCase() : value;
}

function buildAPLDirective(programData) {
    const data = {
        ...programData,
        stationName: upper(programData.stationName),
        stationSlogan: upper(programData.stationSlogan),
        now: {
            ...programData.now,
            category: upper(programData.now.category)
        }
    };

    return {
        type: 'Alexa.Presentation.APL.RenderDocument',
        token: 'apl-radio-uas-skill-v2',
        document: aplDocument,
        datasources: { programData: data }
    };
}

module.exports = { supportsVideo, supportsAPL, buildAPLDirective };
