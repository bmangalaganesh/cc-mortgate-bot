'use strict';

const store = {};

function retrieveContextFromId(userId) {
  // try to retrieve the context object for a certain id
  // if no context is found, set the context to an empty object
  let context;
  if (store[userId]) {
    context = store[userId];
  } else {
    // on the first pass, this will be our context object
    context = {};
  }

  return context;
}

function updateContext(id, context) {
  // update or store the context for the first time.
  // the update is expected to be found in the message object
  // for the platform. Because we don't need to send it over,
  // we delete it after saving the context.
  store[id] = context;
}

module.exports = {
  retrieveContextFromId,
  updateContext,
};
