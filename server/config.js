'use strict';

const cfenv = require('cfenv');
const appEnv = cfenv.getAppEnv();

const socketioSettings = {
  id: 'mortgage-bot:234erw34sr',
};

const messengerSettings = {
  credentials: {
    verifyToken: '2087ey5dr783ow4iudr983ie',
    pageToken:'EAADI6rLXDUkBAJuAOpZCw9HYSHJgEuQVWgVLQrGxtU2NXXL2cDXRsmxDEqvitgMixSCbtaVTtZAdIU92yrMb8be5aOoKJYi7IA3uXTNCabLsrEWKdGZBxto91M9V59M9PmlpetgDCwZCZAHkSsiloNm1IPIrGaVGPEZAMzxFO1wAZDZD',
    fbAppSecret: '1f072c7b0cc3e48889defe293c1bce86',
  },
  webhookEndpoint: '/webhookbrah',
};

const twitterSettings = {
  credentials: {
    consumerKey: 'gB99uwfRODwEvDhqTXQ5n8LcJ',
    consumerSecret: 'SjKx4Y2kMUNfqeJa63xmtHwKn5VA0tMSoBU988yWlSgHDpawmC',
    accessToken: '796305329399152640-UjMTsfVbXluTNyC1zij03z1F2Ifo5e0',
    accessTokenSecret: 'Dv5WMW7PKtbHTY6EaRIqRrRyJNpA3Te6OzAhMNjsp8zsL',
  },
};

const botsSettings = [
  { socketio: socketioSettings },
  { messenger: messengerSettings },
  { twitter: twitterSettings },
];

const botmasterSettings = {
  botsSettings,
  port: appEnv.isLocal ? 3000 : appEnv.port,
};

const watsonConversationSettings = {
  username: 'edd54d3a-04aa-4cfa-8d6b-0ce499415550',
  password: 'C7kzmJjoWRVu',
  version: 'v1',
  version_date: '2016-05-19',
};

let watsonConversationWorkspace;

if (appEnv.isLocal) {
  watsonConversationWorkspace = 'c65f0eda-fd3a-4841-8e85-f809c847ee5c';
  // watsonConversationWorkspace = 'b394df23-3f44-4511-bb31-99cf0b229222';
} else {
  watsonConversationWorkspace = 'c65f0eda-fd3a-4841-8e85-f809c847ee5c';
}

module.exports = {
  botmasterSettings,
  watsonConversationSettings,
  watsonConversationWorkspace,
};
