// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/
/* eslint-disable  func-names */
/* eslint-disable  no-console */

const httpGet = require('./get_http.js');

const Alexa = require('ask-sdk-core');
const {
  getRequestType,
  getIntentName,
  getSlotValue,
  getDialogState,
} = require('ask-sdk-core');

const SKILL_NAME = 'Coffee Time';
const GET_FACT_MESSAGE = 'Here\'s your fact: ';
const HELP_MESSAGE = 'You can say tell me a coffee fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

const LaunchRequestHandler = {
  canHandle(handlerInput) {
      const request = handlerInput.requestEnvelope.request;
      return request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
      const welcomeOutput = 'Welcome to ' + SKILL_NAME + '. I currently know facts about coffee and espresso, and I can help you with some v60 recipes. What would you like to do?';
      const welcomeReprompt = 'Would you like a brew recipe or some coffee knowledge?';
      
      return handlerInput.responseBuilder
        .speak(welcomeOutput)
        .reprompt(welcomeReprompt)
        .getResponse();
  },
};

// Obtaining the random fact from S3 through APIGateway and Lambda. The choices are passed as query parameters in the URL to the GET request
const GetNewFactHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (request.type === 'IntentRequest' && request.intent.name === 'GetNewFactIntent');
    // return request.type === 'LaunchRequest'
      // || (request.type === 'IntentRequest'
        // && request.intent.name === 'GetNewFactIntent');
  },
  async handle(handlerInput) {
    const subjectValue = getSlotValue(handlerInput.requestEnvelope, 'subject');
    const url = "https://qcc1ocbdrl.execute-api.us-east-1.amazonaws.com/staging/fact?subject=" + subjectValue;
    const randomFact = await httpGet(url);
    const speechOutput = 'Your subject is: ' + subjectValue + '.<break time="1s"/> ' + GET_FACT_MESSAGE + randomFact;
    const repromptFact = 'Do you want to hear another ' + subjectValue + ' fact?';

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(SKILL_NAME, randomFact)
      .reprompt(repromptFact)
      .getResponse();
  },
};

// Handling the user's request to explore brew recipes
const BrewRecipeHandler = {
  canHandle(handlerInput) {        
    const request = handlerInput.requestEnvelope.request;
    return (request.type === 'IntentRequest' && request.intent.name === 'BrewRecipeIntent');
  },
  handle(handlerInput) {
  // async handle(handlerInput) {  
    //const subjectValue = getSlotValue(handlerInput.requestEnvelope, 'subject');
    // const url = "https://qcc1ocbdrl.execute-api.us-east-1.amazonaws.com/staging/fact?subject=" + subjectValue;
    // const randomFact = await httpGet(url);
    // const speechOutput = 'Your subject is: ' + subjectValue + '.<break time="1s"/> ' + GET_FACT_MESSAGE + randomFact;
    // const repromptFact = 'Do you want to hear another ' + subjectValue + ' fact?';
    const brewRecipeIntro = 'There are 3 Hario v60 brew recipes you can choose from. The Onyx Coffee Lab recipe, a recipe by James Hoffmann, and the four-six method. Which recipe would you like to use?';
    const brewReprompt = 'Which v60 method would you like to choose?';
    
    return handlerInput.responseBuilder
      .speak(brewRecipeIntro)
      //.withSimpleCard(SKILL_NAME, randomFact)
      .reprompt(brewReprompt)
      .getResponse();
  },
};

// Obtaining the user's choice for brew recipe and using GET to retrieve from S3
const GetBrewRecipeChoiceHandler = {
  canHandle(handlerInput) {        
    const request = handlerInput.requestEnvelope.request;
    return (request.type === 'IntentRequest' && request.intent.name === 'GetBrewRecipeChoice');
  },
  async handle(handlerInput) {  

    // const url = "https://qcc1ocbdrl.execute-api.us-east-1.amazonaws.com/staging/fact?subject=" + subjectValue;
    // const randomFact = await httpGet(url);
    // const speechOutput = 'Your subject is: ' + subjectValue + '.<break time="1s"/> ' + GET_FACT_MESSAGE + randomFact;
    // const repromptFact = 'Do you want to hear another ' + subjectValue + ' fact?';
    
    var brewMethod = getSlotValue(handlerInput.requestEnvelope, 'method');
    var brewMethodStripped = brewMethod.replace(/\s+/g, '');
    brewMethodStripped = brewMethodStripped.toUpperCase();
    const url = "https://kksu51i5l5.execute-api.us-east-1.amazonaws.com/staging/recipe?method=" + brewMethodStripped;
    const brewRecipe = await httpGet(url);
    const presentBrewMethod = brewRecipe;
    const brewReprompt = 'Which v60 method would you like to choose?';
    
    return handlerInput.responseBuilder
      .speak(presentBrewMethod)
      //.withSimpleCard(SKILL_NAME, randomFact)
      .reprompt(brewReprompt)
      .getResponse();
  },
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .reprompt(HELP_REPROMPT)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(STOP_MESSAGE)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, an error occurred. Ask me for another fact instead.')
      .reprompt('Sorry, an error occurred.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    GetNewFactHandler,
    BrewRecipeHandler,
    GetBrewRecipeChoiceHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();