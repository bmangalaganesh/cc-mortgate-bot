'use strict';

const store = require('../../storage/memory_store');

function performFoundCommands(bot, update, next) {
  const userText = update.message.text;
  const userId = update.sender.id;

  if (userText === '/restart' || userText === 'restart') {
    // make sure this
    store.updateContext(userId, undefined);
    // update the context to {} using proper method
    update.context = store.retrieveContextFromId(userId);
    return bot.sendTextMessageTo(
      'Your session has successfully been restarted!', userId)
    .then(next.bind(null, null));
  }

  return next();
}

module.exports = {
  performFoundCommands,
};
