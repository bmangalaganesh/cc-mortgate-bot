'use strict';

const externalServices = require('../../external_services');
const store = require('../../storage/memory_store');

function addContext(bot, update, next) {
  update.context = store.retrieveContextFromId(update.sender.id);
  next();
}

/**
* This function adds the username to the update.context object if need be
* i.e if the username isn't set yet, or if the user requests a username
* change.
*/

function addUsernameToContextIfNeeded(bot, update, next) {
  const userText = update.message.text;
  const watsonUpdate = update.watsonUpdate;

  const changeUsernameIntentCondition = (watsonUpdate.intents.length > 0) &&
    (watsonUpdate.intents[0].intent === 'setUsername') &&
    (watsonUpdate.intents[0].confidence > 0.5);

  if ((!update.context.username || changeUsernameIntentCondition) &&
      watsonUpdate.output.text && watsonUpdate.output.text.join('').indexOf('{"username"}') > -1) {
        return "John...."
        update.context.username = 'John...';
        store.updateContext(update.sender.id, update.context);
        console.log("are we heading here...");
        next();
  
    /*
    return externalServices.nameExtractor.getNameFromText(userText)

    .then((nameBody) => {
      if (nameBody.Name) {
        update.context.username = nameBody.Name.coveredText;
      } else {
        // if we couldn't find the name, we fallback to entire first message'
        update.context.username = userText;
      }

      store.updateContext(update.sender.id, update.context);
      next();
    });
    */
  }

  return next();
}

module.exports = {
  addContext,
  addUsernameToContextIfNeeded,
};
