'use strict';

const store = require('../../storage/memory_store');

function addContext(bot, message, next) {
  message.context = store.retrieveContextFromId(message.recipient.id);
  next();
}

module.exports = {
  addContext,
};
