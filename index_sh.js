

//Dependencies are listed bellow. "apiKey_sh.js" contains the api key for www.superheroapi.com
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const API_KEY = require('./apiKey_sh');

const server = express();
server.use(bodyParser.urlencoded({
    extended: true
}));

server.use(bodyParser.json());

server.post('/get-superhero-info', (req, res) => {

    const superheroToSearch = req.body.queryResult && req.body.queryResult.outputContexts[0] && req.body.queryResult.outputContexts[0].parameters && req.body.queryResult.outputContexts[0].parameters.superhero
    const choice = req.body.queryResult && req.body.queryResult.outputContexts[0] && req.body.queryResult.outputContexts[0].parameters && req.body.queryResult.outputContexts[0].parameters.number-1
    //const superheroToSearch = req.body.queryResult.outputContexts[0].parameters.superhero ? req.body.queryResult.outputContexts[0].parameters.superhero : 'Hulk';
    const intent = req.body.queryResult.intent.displayName //? req.body.queryResult.intent.displayName : 'superhero-intent';
    const reqUrl = 'http://www.superheroapi.com/api.php/' + API_KEY + '/search/' + superheroToSearch;
    http.get(reqUrl, (responseFromAPI) => {
        let completeResponse = '';
        responseFromAPI.on('data', (chunk) => {
            completeResponse += chunk;
        });
        responseFromAPI.on('end', () => {
            const superhero = JSON.parse(completeResponse);
            const intent_check = intent;
            if (superhero.response === 'error') {
              var dataToSend = `A ${superhero.error}, unfortunatly. Please try another superhero or check your spelling.`
              return res.json({
                  'fulfillmentText': dataToSend
              });
            }

            if (intent_check === 'superhero-intent') {
              var search_results = new Array(superhero.results.length)
              if (superhero.results.length === 1) {
                var dataToSend = `Your search matched ${superhero.results[0].name}.\n Press 1 to get more information on ${superhero.results[0].name}.`
              }
              else {
                for (i=0; i < superhero.results.length; i++) {
                  search_results[i] = ' ' + superhero.results[i].name
                  if (i === (superhero.results.length-1)) {
                    search_results[i] = ' and ' + superhero.results[i].name
                  }
                }
                var dataToSend = `Your search matched${search_results}.\n Answer a number to select which one you want more information about.`
              }
            }
            if (intent_check === 'superhero-intent-choice') {
              //const choice = req.body.queryResult && req.body.queryResult.outputContexts[0] && req.body.queryResult.outputContexts[0].parameters && req.body.queryResult.outputContexts[0].parameters.number
              if (superhero.results[choice].appearance.gender === 'Male') {
                var gender_specific = ['His', 'his', 'he']
              }
              else if (superhero.results[choice].appearance.gender === 'Female') {
                var gender_specific = ['Her', 'her', 'she']
              }
              var alignment = superhero.results[choice].biography.alignment
              if (alignment === '-') {
                pob = 'unknown'
              }
              var pob = superhero.results[choice].biography['place-of-birth']
              if (pob === '-' || pob === '') {
                pob = 'unknown'
              }
              var real_name = superhero.results[choice].biography['full-name']
              if (real_name === '-' || real_name === '' ) {
                real_name = 'unknown'
              }
              var aliases = superhero.results[choice].biography.aliases
              var i;
              if (aliases.length === 1) {
                if (aliases[0] === '-' || aliases[0] === '') {
                  aliases[0] = ' unknown'
                }
                else {
                  aliases[0] = ' ' + aliases[0]
                }
              }
              else {
                for (i=0; i < aliases.length; i++) {
                  aliases[i] = ' ' + aliases[i]
                  if (i === (aliases.length-1)) {
                    aliases[i] = ' and' + aliases[i]
                  }
                }
              }
              //var dataToSend = superheroToSearch === 'Hulk' ? `I don't have the required info on that. Here's some info on 'Hulk' instead.\n` : '';
              var dataToSend = `${gender_specific[0]} superhero name is ${superhero.results[choice].name},\
 but ${gender_specific[1]} full name is ${real_name}.\
 Among ${gender_specific[1]} aliases are${aliases}.\
 ${gender_specific[0]} place of birth is ${pob},\
 and ${gender_specific[2]} is considered a ${alignment} character.\n\
 Do you want to know about ${superhero.results[choice].name}s powers, ${gender_specific[1]} physical traits or see an image of ${superhero.results[choice].name}?`;
            }
            if (intent_check === 'superhero-intent-powers') {
              var dataToSend = `Here is a summary of ${superhero.results[choice].name}s powers:\n\
 Intelligence: ${superhero.results[choice].powerstats.intelligence}.\n\
 Strength: ${superhero.results[choice].powerstats.strength}.\n\
 Speed: ${superhero.results[choice].powerstats.speed}.\n\
 Durability: ${superhero.results[choice].powerstats.durability}.\n\
 Power: ${superhero.results[choice].powerstats.power}.\n\
 Combat: ${superhero.results[choice].powerstats.combat}.\n\
 Do you want information on ${superhero.results[choice].name}s physical traits or see an image of ${superhero.results[choice].name}?`;
            }
            if (intent_check === 'superhero-intent-physical') {
              var dataToSend = `Here is some information on ${superhero.results[choice].name}s physical attributes:\n\
 Race: ${superhero.results[choice].appearance.race}.\n\
 Height: ${superhero.results[choice].appearance.height[1]}.\n\
 Weight: ${superhero.results[choice].appearance.weight[1]}.\n\
 Do you want information on ${superhero.results[choice].name}s powers or see an image of ${superhero.results[choice].name}?`;
            }
            if (intent_check === 'superhero-intent-image') {
              var dataToSend = `Here is a link to an image of ${superhero.results[choice].name}:\n\
 ${superhero.results[choice].image.url}\n\
 Do you want to know about ${superhero.results[choice].name}s powers or the physical traits?`
            }
            return res.json({
                'fulfillmentText': dataToSend
            });
        });
    });
});

server.listen((process.env.PORT || 5000), () => {
    console.log("SH Server is up and running...");
});
