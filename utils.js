const Alexa = require('ask-sdk-core');

function supportsVideo(handlerInput) {
    const supportedInterfaces = Alexa.getSupportedInterfaces(handlerInput.requestEnvelope);
    return supportedInterfaces.VideoApp;
}

module.exports = { supportsVideo };
