const Alexa = require('ask-sdk-core');
const { buildRadioResponse, buildStopRadioResponse } = require('./audio');
const { buildVideoResponse } = require('./video');

const UserEventHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.APL.UserEvent';
    },
    async handle(handlerInput) {
        const args = handlerInput.requestEnvelope.request.arguments || [];
        const action = args[0];

        if (action === 'tv') {
            return buildVideoResponse(handlerInput);
        }
        if (action === 'pause') {
            return buildStopRadioResponse(handlerInput);
        }
        return buildRadioResponse(handlerInput);
    },
};

module.exports = { UserEventHandler };
