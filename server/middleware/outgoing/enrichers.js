'use strict';

const cfenv = require('cfenv');
const appEnv = cfenv.getAppEnv();
const mortgageCalculator = require('../../utils/mortgage_calculator');
const getEligibleMortgages = require('../../utils/mortgages_comparator').getEligibleMortgages;

function addButtonsToMessage(bot, message, next) {
  if (!message.message || !message.message.text) {
    return next();
  }

  const text = message.message.text;

  const buttonsRegexObject = text.match(/&\[.+]/);
  if (buttonsRegexObject) {
    try {
      const buttonTitles = JSON.parse(buttonsRegexObject[0].substring(1));
      const cleanedText = text.replace(buttonsRegexObject[0], '');

      message.message.quick_replies = [];
      for (const buttonTitle of buttonTitles) {
        message.message.quick_replies.push({
          content_type: 'text',
          title: buttonTitle,
          payload: buttonTitle, // indeed, in default mode payload in buttonTitle
        });
      }

      message.message.text = cleanedText;
    } catch (err) {
      // we make sure text is not updated so that conversation designer/user
      // sees problem.
      console.log(err);
    }
  }

  next();
}

function addUsernameToText(bot, message, next) {
  if (!message.message || !message.message.text) {
    return next();
  }

  const text = message.message.text;
  let modifiedText;

  if (text.indexOf('{"username"}') > -1) {
    modifiedText = text.replace('{"username"}', message.context.username);
  }

  message.message.text = modifiedText || text;
  return next();
}

function addOfferableMortgageValueToText(bot, message, next) {
  if (!message.message || !message.message.text) {
    return next();
  }

  const text = message.message.text;
  let modifiedText;

  if (text.indexOf('{"offerableMortgageValue"}') > -1) {
    const offerableMortgageValue = mortgageCalculator.compute(message.context);

    if (offerableMortgageValue) {
      modifiedText = text.replace('{"offerableMortgageValue"}',
        `${offerableMortgageValue.toLocaleString()}`);
    } else {
      modifiedText = 'There was an error in our system. Please report this.';
    }
  }

  message.message.text = modifiedText || text;
  return next();
}

function addSuitableMortgagesListLink(bot, message, next) {
  if (!message.message || !message.message.text) {
    return next();
  }

  const text = message.message.text;
  let modifiedText;

  if (text.indexOf('{"mortgagesLink"}') > -1) {
    const propertyValue = message.context.prefs.propertyValue;
    const deposit = message.context.prefs.deposit;
    const repaymentType = message.context.prefs.repaymentType;
    const repaymentPeriod = message.context.prefs.repaymentPeriod;
    const mortgageType = message.context.prefs.mortgageType;

    if (propertyValue && deposit && repaymentType &&
        repaymentPeriod && mortgageType) {
      const eligibleMortgages = getEligibleMortgages({
        propertyValue,
        deposit,
        repaymentType: repaymentType.replace(/ /g, '-').replace('&', 'and'),
        repaymentPeriod,
        mortgageType: mortgageType.replace(/ /g, '-'),
      });
      if (eligibleMortgages.length < 1) {
        modifiedText = 'Unfortunately, based on the information you provided, we couldn\'t find any suitable mortgages that you would be eligible for.';
      } else {
        let eligibleMortgagesLink;
        if (appEnv.isLocal) {
          eligibleMortgagesLink = 'http://localhost:3000/eligibleMortgages.html';
        } else {
          eligibleMortgagesLink = 'https://anz-mortgage-bot.au-syd.mybluemix.net/eligibleMortgages.html';
        }
        eligibleMortgagesLink += `?propertyValue=${propertyValue}`;
        eligibleMortgagesLink += `&deposit=${deposit}`;
        eligibleMortgagesLink += `&repaymentType=${repaymentType.replace(/ /g, '-').replace('&', 'and')}`;
        eligibleMortgagesLink += `&repaymentPeriod=${repaymentPeriod}`;
        eligibleMortgagesLink += `&mortgageType=${mortgageType.replace(/ /g, '-')}`;
        if (bot.type === 'socketio') {
          modifiedText = text.replace('{"mortgagesLink"}',
            `<a target="_blank" href="${eligibleMortgagesLink}">List of eligible mortgages</a>`);
        } else {
          modifiedText = text.replace('{"mortgagesLink"}', eligibleMortgagesLink);
        }
      }
    } else {
      modifiedText = 'There was an error in our system. Please report this.';
    }
  }

  message.message.text = modifiedText || text;
  return next();
}


module.exports = {
  addButtonsToMessage,
  addUsernameToText,
  addOfferableMortgageValueToText,
  addSuitableMortgagesListLink,
};
