
'use strict';

/* global ConversationPanel: true, PayloadPanel: true*/
/* eslint no-unused-vars: "off" */

require('../css/app.scss');
// Other JS files required to be loaded first: apis.js, conversation.js, payload.js
var ConversationPanel = require('./conversation');

// Initialize module
ConversationPanel.init();

module.exports = {
  ConversationPanel: ConversationPanel,
};
