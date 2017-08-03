'use strict';

const XLSX = require('xlsx');

const workbook = XLSX.readFile('hsbc_mortgages.XLSX');

const firstSheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[firstSheetName];

const mortgagesInformation = XLSX.utils.sheet_to_json(worksheet);

module.exports = {
  mortgagesInformation,
};
