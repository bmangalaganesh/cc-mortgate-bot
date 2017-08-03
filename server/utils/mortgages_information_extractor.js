'use strict';

const XLSX = require('xlsx');

const workbook = XLSX.readFile('./server/config/anz_mortgages.xlsx');

const firstSheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[firstSheetName];

const mortgagesInformation = XLSX.utils.sheet_to_json(worksheet);

module.exports = {
  mortgagesInformation,
};
