'use strict';

// set constants
const currentSVR = 3.69 / 100; // current standard variable rate
const forecastedSVR = 6.25 / 100;
const tolerance = 0;
const minRate = 5 / 100; // minimum rate to use in calculation
const maxSalaryMultiple = 5;
const inflation = 0.6/100;
const debtToIncome = 0.5;

const rateUsed = Math.max(minRate, forecastedSVR) + tolerance;

//////////////////////
// helper mid steps functions
////////////////////

// 1)
function calculateIncomeTax(salary) {
  let incomeTax;
  const basicTax = 11000;
  const midTax = 43000;
  const highTax = 150000;

  const allowanceReductions = Math.max(0, (salary - 1000) * 0.5);
  const allowance = Math.max(0, basicTax - allowanceReductions);

  if (salary <= basicTax) {
    incomeTax = 0;
  } else if (salary <= midTax) {
    incomeTax = 0.2 * (salary - basicTax);
  } else if (salary <= highTax) {
    const fourtyPercentTaxed = (salary - (midTax - (basicTax - allowance))) * 0.4;
    const twentyPercentTaxed = (midTax - basicTax) * 0.2;
    incomeTax = fourtyPercentTaxed + twentyPercentTaxed;
  } else {
    const fourtyFivePercentTaxed = (salary - highTax) * 0.45;
    const fourtyPercentTaxed = (highTax - (midTax - basicTax)) * 0.4;
    const twentyPercentTaxed = (midTax - basicTax) * 0.2;
    incomeTax = fourtyFivePercentTaxed + fourtyPercentTaxed + twentyPercentTaxed;
  }

  return incomeTax;
}

// 2)
function calculateNationInsurance(salary) {
  let nationalinsurance;
  const lowerProfitsLimit = 8060;
  const upperProfitsLimit = 43000;

  if (salary <= lowerProfitsLimit) {
    nationalinsurance = 0;
  } else if (salary <= upperProfitsLimit) {
    nationalinsurance = (salary - lowerProfitsLimit) * 0.12;
  } else {
    const twelvePercentNI = (upperProfitsLimit - lowerProfitsLimit) * 0.12;
    const twoPercentNI = (salary - upperProfitsLimit) * 0.02;
    nationalinsurance = twelvePercentNI + twoPercentNI;
  }

  return nationalinsurance;
}

// 3)
function calculateLTVOffer(deposit) {
  let LTVOffer;

  if (deposit < 44445) {
    LTVOffer = 9 * deposit;
  } else if (deposit < 100000) {
    LTVOffer = 400000; // was 399999, but seems weird
  } else if (deposit < 250000) {
    LTVOffer = 4 * deposit;
  } else if (deposit < 333333) {
    LTVOffer = 1000000;
  } else if (deposit < 666667) {
    LTVOffer = 3 * deposit;
  } else if (deposit < 1076923) {
    LTVOffer = 2000000;
  } else if (deposit < 35000000) {
    LTVOffer = (deposit / 0.35) - deposit;
  } else {
    LTVOffer = (35000000 / 0.35) - 35000000;
  }

  return LTVOffer;
}

// 3)
function calculateAffordabilityOffer(monthlyMortgagePaymentCapped, mortgageTerm) {
  const partOne = (monthlyMortgagePaymentCapped / rateUsed) * 12;
  const partTwo = (1 - (1 / Math.pow((1 + (rateUsed / 12)), (mortgageTerm * 12))));

  const affordabilityOffer = Math.max(0, partOne * partTwo);
  return affordabilityOffer;
}

// 4)
function calculateIncomeMultipleCapOffer(grossMonthlySalary) {
  return grossMonthlySalary * 12 * maxSalaryMultiple;
}

///////////////////////
// main compute function
//////////////////////

function compute(context) {
  let mortgageValue;
  if (!context.prefs) {
    return mortgageValue;
  }

  const income = context.prefs.income;
  const salary = income; // for this calculation, we assume only source of income is salary
  const outgoings = context.prefs.outgoings;
  const deposit = context.prefs.deposit;
  const repaymentPeriod = context.prefs.repaymentPeriod;
  const mortgageTerm = repaymentPeriod;

  // variables used to carry out the final computation
  const grossMonthlySalary = salary / 12;
  const incomeTax = calculateIncomeTax(salary);
  const nationalinsurance = calculateNationInsurance(salary);
  const monthlyTax = (incomeTax + nationalinsurance) / 12;
  const monthlyHouseholdExpenditure = outgoings; // our assumption here
  const monthlyMortgagePayment = grossMonthlySalary - monthlyHouseholdExpenditure - monthlyTax;
  const monthlyMortgagePaymentCapped = Math.min(monthlyMortgagePayment,
    // dividing by 2 here, because in the algorithm , it is only the credit commitmens.
    // this is a crude approximation
    // monthlyMortgagePayment);
    (debtToIncome * grossMonthlySalary) - (monthlyHouseholdExpenditure / 2));

  // the three offers:
  const LTVOffer = calculateLTVOffer(deposit);
  // console.log(LTVOffer);
  const affordabilityOffer = calculateAffordabilityOffer(
    monthlyMortgagePaymentCapped, mortgageTerm);
  // console.log(affordabilityOffer);
  const incomeMultipleCapOffer = calculateIncomeMultipleCapOffer(
    grossMonthlySalary);
  // console.log(incomeMultipleCapOffer);

  mortgageValue = Math.min(LTVOffer, affordabilityOffer, incomeMultipleCapOffer);

  mortgageValue = Math.floor(mortgageValue / 1000) * 1000;

  return mortgageValue;
}

module.exports = {
  compute,
};
