
const Botmaster = require('botmaster');
const express = require('express');

const incomingMiddleware = require('./middleware/incoming');
const outgoingMiddleware = require('./middleware/outgoing');
const getEligibleMortgages = require('./utils/mortgages_comparator').getEligibleMortgages;

const config = require('./config');

const botmaster = new Botmaster(config.botmasterSettings);

// express code

botmaster.app.use(express.static(`${__dirname}/../public`));

botmaster.app.get('/eligibleMortgages', (req, res) => {
  const eligibleMortgages = getEligibleMortgages(req.query);
  res.json(eligibleMortgages);
});

// actual botmaster code

botmaster.use('incoming', incomingMiddleware.watsonContext.addContext);
botmaster.use('incoming', incomingMiddleware.commands.performFoundCommands);
botmaster.use('incoming', incomingMiddleware.watsonUpdate.addWatsonUpdate);
botmaster.use('incoming', incomingMiddleware.watsonContext.addUsernameToContextIfNeeded);

botmaster.on('update', (bot, update) => {
  const watsonUpdate = update.watsonUpdate;
  const userId = update.sender.id;
  const watsonTextArray = watsonUpdate.output.text;

  // console.log(JSON.stringify(watsonUpdate, null, 2));

  return bot.sendTextCascadeTo(watsonTextArray, userId);
});

botmaster.use('outgoing', outgoingMiddleware.watsonContext.addContext);
botmaster.use('outgoing', outgoingMiddleware.enrichers.addButtonsToMessage);
botmaster.use('outgoing', outgoingMiddleware.enrichers.addUsernameToText);
botmaster.use('outgoing', outgoingMiddleware.enrichers.addOfferableMortgageValueToText);
botmaster.use('outgoing', outgoingMiddleware.enrichers.addSuitableMortgagesListLink);
// add sendIsTypingMessageTo timer function
botmaster.use('outgoing', (bot, message, next) => {
  if (!message.message || !message.message.text) {
    return next();
  }
  // console.log(JSON.stringify(message, null, 2));
  const text = message.message.text;
  // let delay = 0;
  let delay = Math.max(1200, text.length * 20); // a couple of arbitrary numbers
  if (text === 'Let me think about this for a moment.') {
    delay = 1800;
  }
  const userId = message.recipient.id;

  return bot.sendIsTypingMessageTo(userId)

  .then(() => {
    setTimeout(() => {
      next();
    }, delay);
  });
});

botmaster.on('server running', (message) => {
  console.log(message);
});

botmaster.on('error', (bot, err) => {
  console.log(err.stack);
});
