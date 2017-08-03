// The Api module is designed to handle all interactions with the server

var socket = io('');
var requestPayload;
var responsePayload;
var messageEndpoint = '/api/message';

socket.on('message', function(msg){
  Api.setResponsePayload(msg);
});

// Send a message request to the server
function sendRequest(text, dontShow) {
  var outgoingMessage = { text: text };
  socket.send(outgoingMessage);
  if (!dontShow) {
    Api.setRequestPayload(outgoingMessage);
  }
}

var Api = {
  sendRequest: sendRequest,

  // The request/response getters/setters are defined here to prevent internal methods
  // from calling the methods without any of the callbacks that are added elsewhere.
  getRequestPayload: function() {
    return requestPayload;
  },
  setRequestPayload: function(newPayloadStr) {
    requestPayload = newPayloadStr;
  },
  getResponsePayload: function() {
    return responsePayload;
  },
  setResponsePayload: function(newPayloadStr) {
    responsePayload = newPayloadStr;
  }
};

module.exports = Api;
