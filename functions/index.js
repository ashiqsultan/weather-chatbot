'use strict';
 
//Firebase related imports
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

//Other Modules 
const express = require('express')
const axios = require('axios');
const cors = require('cors')
require('dotenv').config()

//Custom Modules
const getWeather = require('./getWeather.js');

const app = express()
const WEATHER_API = process.env.WEATHER_API;

//*MIDDELWARE* -- Cross-origin resource sharing  
//app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended:false}))

// function welcome (agent) {
//   agent.add(`Welcome to Express.JS webhook!`);
// }

// function fallback (agent) {
//   agent.add(`I didn't understand`);
//   agent.add(`I'm sorry, can you try again?`);
// }

async function ask_weather(agent) {
  const city_name = agent.parameters['city'];
  const reply = await getWeather(city_name);
  agent.add(reply.toString());
  //agent.add(`weather condition for ${city_name}`);
  // ** need to implement random responce **
}

function WebhookProcessing(req, res) {
  const agent = new WebhookClient({request: req, response: res});
  console.info(`agent set`);

  let intentMap = new Map();
  //intentMap.set('Default Welcome Intent', welcome);
  //intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('ask_weather', ask_weather);
  //intentMap.set('<INTENT_NAME_HERE>', yourFunctionHandler);
  agent.handleRequest(intentMap);
}

// Webhook
app.post('/', (req, res) => {
  console.info(`\n\n>>>>>>> S E R V E R   H I T <<<<<<<`);
  WebhookProcessing(req, res);
});

// app.listen(8080, function () {
//   console.info(`Webhook listening on port 8080!`)
// });

exports.app = functions.https.onRequest(app);
