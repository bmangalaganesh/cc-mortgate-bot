'use strict';

const getEligibleMortgages = require('./server/utils/mortgages_comparator').getEligibleMortgages;
const computeOfferableMortgageValue = require('./server/utils/mortgage_calculator').compute;

const _ = require('lodash');

// console.log(mortgagesInformation);

// mortgages = getEligibleMortgages({
//   propertyValue: 1000000,
//   repaymentType: 'Capital-and-Interest',
//   repaymentPeriod: 30,
//   mortgageType: 'Tracker-rate-mortgages',
//   deposit: 300000,
// });

// console.log(mortgages.length);

const mortgageValue = computeOfferableMortgageValue({
  prefs: {
    income: 100000,
    outgoings: 2500,
    deposit: 25000,
    repaymentPeriod: 6,
  },
});

console.log(mortgageValue);
