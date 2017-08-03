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
  username: '87903249-7910-45f2-be6c-0780e310ed9c',
  password: 'MCUgYiIizOyy',
  version: 'v1',
  version_date: '2016-05-19',
};

let watsonConversationWorkspace;

if (appEnv.isLocal) {
  watsonConversationWorkspace = 'a22ddcfd-cff6-4ca7-9fda-6f631fb9ea72';
  // watsonConversationWorkspace = 'b394df23-3f44-4511-bb31-99cf0b229222';
} else {
  watsonConversationWorkspace = 'ac3c20d9-8564-4d99-ade3-060e4c7e99c3';
}

module.exports = {
  botmasterSettings,
  watsonConversationSettings,
  watsonConversationWorkspace,
};
