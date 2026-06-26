const Alexa = require('ask-sdk-core');
const { LaunchRequestHandler } = require('./handlers/launch');
const { PlayAudioIntentHandler, PlaybackStartedIntentHandler, PlaybackStoppedIntentHandler } = require('./handlers/audio');
const { PlayVideoIntentHandler } = require('./handlers/video');
const { AboutIntentHandler, PlayCustomPhraseIntentHandler } = require('./handlers/info');
const { CancelAndStopIntentHandler, HelpIntentHandler, SessionEndedRequestHandler, ErrorHandler } = require('./handlers/system');

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
    .addRequestHandlers(
        LaunchRequestHandler,
        PlayAudioIntentHandler,
        PlayVideoIntentHandler,
        PlayCustomPhraseIntentHandler,
        AboutIntentHandler,
        CancelAndStopIntentHandler,
        HelpIntentHandler,
        PlaybackStartedIntentHandler,
        PlaybackStoppedIntentHandler,
        SessionEndedRequestHandler
    )
    .addErrorHandlers(ErrorHandler)
    .lambda();
