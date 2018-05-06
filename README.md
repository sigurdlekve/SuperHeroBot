# Chatbot case for Ardoq - SuperHeroBot

This is a chatbot that can answer some simple questions about a vast amount of superheros from www.superheroapi.com.
The chatbot is developed using Dialogflow for its machine learning and chatting interface. The backend and logic is written in Javascript with Node JS framwork.
The webhook connecting Dialogflow and the Javascript backend is deployed on Heroku.

## Getting Started
### Webhook
1. Have Node JS installed.
2. Get an API key from www.superheroapi.com. Follow the instructions.
3. Install Dependencies:
  - express - Used to create a server
  - body-parser - Used to parse incoming request bodies
  ```
  npm install express body-parser
  ```
4. Go to "apiKey_sh.js" and enter your API key from www.superheroapi.com.

The webhook can also be deployed to Heroku. Follow the instruction here: https://devcenter.heroku.com/articles/git

Testing requests both locally and on Heroku is described below in the "Testing" section.

### Dialogflow
Import the dialogflow agent from "SuperHeroBot.zip". 
  - The procedure is described here: https://dialogflow.com/docs/agents
  
Go to Fulfillment and activate webhook. Link to your own webhook deployed on Heroku.
  - The procedure is described here: https://dialogflow.com/docs/fulfillment
  
#### Decription of Intents in Dialogflow
There are 8 intents in the SuperHeroBot. 5 using the webhook and 3 that are handled by Dialogflow.

Handled by Dialogflow:
  - Default Welcome Intent:
  This is the Welcome intent where the chatbot greets you and gives you some simple instructions.
  - Goodbye:
  When this intent is triggered the bot thanks you for talking to it and it considers the conversation as done.
  - Default Fallback Intent:
  When this intent is triggered the bot does not understand what you are trying to do and comes up with variations of "I didn't get that. Can you please repeat?".

Handled by Webhook:
 - superhero-intent:
 Bot understands that you are trying to get information about a superhero. It either responds that it doesnt have anything matching you request or it gives you the results from www.superheroapi.com.
 
    - superhero-intent-choice:
    This is a followup to the former intent where the bot asks you to choose from the superheros matching your request. Underneath are the followup questions you can ask about your chosen superhero.
    
      - superhero-intent-image:
      Gives url-link to picture of superhero in question.
      - superhero-intent-physical:
      Gives a summary of physical traits of superhero.
      - superhero-intent-powers:
      Gives a summary of powerstats of the superhero.

### Testing Webhook
1. Run "index_sh.js" on command prompt:
  ```
  node index_sh.js
  ```
  You should get a response saying "SH Server is up and running".
  
2. Test a POST request from Postman like shown in the picture below. 

![alt text](Screenshots/postman_example1.jpg "Testing request to postman locally")

You can also test requests to the webhook deplyed on Heroku like shown in the picture below.

![alt text](Screenshots/postman_example2.jpg "Testing request to postman with Heroku webhook")

You can test the different intents by changing the value of the key "displayName" to the different intent-names described above. If you can sucessfully get "fulfillmentText" from all of them your dialogflow chatbot should be ready for use. 

## Integration

To integrate SuperHeroBot to some external application (Messenger, Slack, etc.) follow the instructions here: https://dialogflow.com/docs/integrations/

## Authors

* **Sigurd Lekve** - [sigurdlekve](https://github.com/sigurdlekve)
