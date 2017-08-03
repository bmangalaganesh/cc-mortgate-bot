'use strict';

const mortgagesExtractor = require('./mortgages_information_extractor');
const cloneDeep = require('lodash').cloneDeep;
const sortBy = require('lodash').sortBy;

const mortgagesInformation = mortgagesExtractor.mortgagesInformation;

function getEligibleMortgages(params) {
  const propertyValue = params.propertyValue;
  const repaymentType = params.repaymentType;
  const repaymentPeriod = params.repaymentPeriod;
  const mortgageType = params.mortgageType;
  const deposit = params.deposit;
  const LTV = 100 * ((propertyValue - deposit) / propertyValue);
  const principal = propertyValue - deposit;

  const eligibleMortgagesList = mortgagesInformation

  // filter by LTV
  .reduce((output, mortgage) => {
    if (mortgage['Max Loan To Value (LTV)'] &&
        parseFloat(mortgage['Max Loan To Value (LTV)']) >= LTV) {
      output.push(mortgage);
    }
    return output;
  }, [])

  // filter by mortgage type
  .reduce((output, mortgage) => {
    if (mortgageType === 'discounted-mortgage' && mortgage['Discount Rate']) {
      output.push(mortgage);
    } else if (mortgageType === 'Fixed-rate' && mortgage['Followed by a Variable Rate, currently']) {
      output.push(mortgage);
    } else if (mortgageType === 'Tracker-rate-mortgages' && mortgage['BOE Base Rate (Tracker margin)']) {
      output.push(mortgage);
    }

    return output;
  }, [])

  // add initial illustrative monthly payment to array
  .map((mortgage) => {
    // because this algorithm is in place
    const rMortgage = cloneDeep(mortgage);
    let initialIllustrativeMontlyPayment = 'Nan';

    const initialInterestRate = parseFloat(rMortgage['Initial Interest Rate']) / 100.0;
    const monthlyInterestRate = initialInterestRate / 12.0;
    const interestOnlyPart = principal * monthlyInterestRate;

    if (repaymentType === 'Interest-Only') {
      initialIllustrativeMontlyPayment = Math.ceil(interestOnlyPart);
    } else if (repaymentType === 'Capital-and-Interest') {
      const paymentCount = 12 * repaymentPeriod;
      const denominator = 1 - Math.pow(1 + monthlyInterestRate, -paymentCount);

      initialIllustrativeMontlyPayment = Math.ceil(interestOnlyPart / denominator);
    }

    rMortgage['Initial illustrative monthly payment'] = initialIllustrativeMontlyPayment;

    return rMortgage;
  })

  // sort list
  .sort((mortgageOne, mortgageTwo) => {
    if (mortgageOne['Initial illustrative monthly payment'] <
        mortgageTwo['Initial illustrative monthly payment']) {
      return -1;
    }

    return 1;
  })

  // format to locale string for added illustrative monthly payment
  .map((mortgage) => {
    const rMortgage = cloneDeep(mortgage);
    const initialIllustrativeMontlyPayment = mortgage['Initial illustrative monthly payment'];
    rMortgage['Initial illustrative monthly payment'] = `$${initialIllustrativeMontlyPayment.toLocaleString()}`;
    return rMortgage;
  });

  return eligibleMortgagesList;
}

module.exports = {
  getEligibleMortgages,
};
