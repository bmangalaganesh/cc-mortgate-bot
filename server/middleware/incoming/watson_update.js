const externalServices = require('../../external_services');
const store = require('../../storage/memory_store');

function addWatsonUpdate(bot, update, next) {
  const userText = update.message.text;
  const userId = update.sender.id;

  return externalServices.watsonConversation.messageWatson(userText, update.context)

  .then((watsonUpdate) => {
    store.updateContext(userId, watsonUpdate.context);
    // The following would only happen on a successful storing
    // in production
    update.context = watsonUpdate.context;
    update.watsonUpdate = watsonUpdate;
    // console.log(JSON.stringify(watsonUpdate, null, 2));

    next();
  });
}

module.exports = {
  addWatsonUpdate,
};
