'use strict';

const request = require('request-promise');
const config = require('./config');
const watson = require('watson-developer-cloud').conversation(
  config.watsonConversationSettings);

const nameExtractor = {
  getNameFromText: (text) => {
    console.log("Who is calling me...");
    const options = {
      uri: `http://uimaae.eu-gb.mybluemix.net/AE/Person?text=${text}&mode=json`,
      method: 'GET',
    };

    return request(options)

    .then((nameBodyString) => {
      // console.log(nameBodyString);
      // JSON.parse(nameBodyString);
      return JSON.parse(nameBodyString);
    });
  },
};

const watsonConversation = {
  messageWatson: (text, context) => {

    console.log("what is the text" + text);
    console.log("what is the config");
    const messageForWatson = {
      context,
      workspace_id: config.watsonConversationWorkspace,
      input: {
        text,
      },
    };
    return new Promise((resolve) => {
      watson.message(messageForWatson,
        (err, watsonUpdate) => {
          if (err) {
            throw err;
          }
          resolve(watsonUpdate);
        });
    });
  },
};

module.exports = {
  nameExtractor,
  watsonConversation,
};
