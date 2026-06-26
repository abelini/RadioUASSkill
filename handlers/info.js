const Alexa = require('ask-sdk-core');

const AboutIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' 
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AboutIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak('Radio Universidad Autónoma de Sinaloa. Frecuencia de la cultura viva.')
            .getResponse();
    },
};

const PlayCustomPhraseIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'PlayCustomPhraseIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak('Holaaaa enfermera')
            .getResponse();
    },  
};

module.exports = { AboutIntentHandler, PlayCustomPhraseIntentHandler };
