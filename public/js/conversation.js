// The ConversationPanel module is designed to handle
// all display and behaviors of the conversation column of the app.
/* eslint no-unused-vars: "off" */
/* Common: true*/

var Api = require('./api.js');
var Common = require('./common.js')

var settings = {
  selectors: {
    chatBox: '#scrollingChat',
    fromUser: '.from-user',
    fromWatson: '.from-watson',
    fromWatsonButton: '.from-watson-button',
    latest: '.latest',
  },
  authorTypes: {
    user: 'user',
    watson: 'watson',
  },
};

// Initialize the module
function init() {
  chatUpdateSetup();
  Api.sendRequest('hi', true);
  setupInputBox();
}
// Set up callbacks on payload setters in Api module
// This causes the displayMessage function to be called when messages are sent / received
function chatUpdateSetup() {
  var currentRequestPayloadSetter = Api.setRequestPayload;
  Api.setRequestPayload = function(newPayloadStr) {
    currentRequestPayloadSetter.call(Api, newPayloadStr);
    displayMessage(newPayloadStr, settings.authorTypes.user);
  };

  var currentResponsePayloadSetter = Api.setResponsePayload;
  Api.setResponsePayload = function(newPayloadStr) {
    currentResponsePayloadSetter.call(Api, newPayloadStr);
    displayMessage(newPayloadStr, settings.authorTypes.watson);
  };
}

// Set up the input box to underline text as it is typed
// This is done by creating a hidden dummy version of the input box that
// is used to determine what the width of the input text should be.
// This value is then used to set the new width of the visible input box.
function setupInputBox() {
  var input = document.getElementById('textInput');
  var dummy = document.getElementById('textInputDummy');
  var minFontSize = 14;
  var maxFontSize = 16;
  var minPadding = 4;
  var maxPadding = 6;

  // If no dummy input box exists, create one
  if (dummy === null) {
    var dummyJson = {
      'tagName': 'div',
      'attributes': [{
        'name': 'id',
        'value': 'textInputDummy'
      }]
    };

    dummy = Common.buildDomElement(dummyJson);
    document.body.appendChild(dummy);
  }

  function adjustInput() {
    if (input.value === '') {
      // If the input box is empty, remove the underline
      var classNames = input.className.split(' ');
      classNames.splice(classNames.indexOf('underline'), 1);
      input.className = classNames.join(' ');
      input.setAttribute('style', 'width:' + '100%');
      input.style.width = '100%';
    } else {
      // otherwise, adjust the dummy text to match, and then set the width of
      // the visible input box to match it (thus extending the underline)
      input.className += ' underline';
      var txtNode = document.createTextNode(input.value);
      ['font-size', 'font-style', 'font-weight', 'font-family', 'line-height',
        'text-transform', 'letter-spacing'].forEach(function(index) {
          dummy.style[index] = window.getComputedStyle(input, null).getPropertyValue(index);
        });
      dummy.textContent = txtNode.textContent;

      var padding = 0;
      var htmlElem = document.getElementsByTagName('html')[0];
      var currentFontSize = parseInt(window.getComputedStyle(htmlElem, null).getPropertyValue('font-size'), 10);
      if (currentFontSize) {
        padding = Math.floor((currentFontSize - minFontSize) / (maxFontSize - minFontSize)
          * (maxPadding - minPadding) + minPadding);
      } else {
        padding = maxPadding;
      }

      var widthValue = ( dummy.offsetWidth + padding) + 'px';
      input.setAttribute('style', 'width:' + widthValue);
      input.style.width = widthValue;
    }
  }

  // Any time the input changes, or the window resizes, adjust the size of the input box
  input.addEventListener('input', adjustInput);
  window.addEventListener('resize', adjustInput);

  // Trigger the input event once to set up the input box and dummy element
  Common.fireEvent(input, 'input');
}

// Display a user or Watson message that has just been sent/received
function displayMessage(newPayload, typeValue) {
  // console.log(newPayload);
  var isUser = isUserMessage(typeValue);
  // var textExists = (newPayload.text) || (newPayload.message && newPayload.message.text);
  if (isUser !== null) {
    // Create new message DOM element
    var messageDivs = buildMessageDomElements(newPayload, isUser);
    var chatBoxElement = document.querySelector(settings.selectors.chatBox);

    // this latest bit of code just helps say which line needs to have
    // its 'latest' tage removed
    var previousLatestWatsonTextSelector = settings.selectors.fromWatson +
                                           settings.selectors.latest

    var previousLatestButtonsSelector = settings.selectors.fromWatsonButton +
                                        settings.selectors.latest;

    var previousLatestUserTextSelector = settings.selectors.fromUser +
                                           settings.selectors.latest

    var previousLatest = chatBoxElement.querySelectorAll(
      previousLatestWatsonTextSelector + ',' +
      previousLatestButtonsSelector + ',' +
      previousLatestUserTextSelector);

    if (isUser === true && previousLatest) {
      Common.listForEach(previousLatest, function(element) {
        var classNames = element.className.split(' ');
        classNames.splice(classNames.indexOf('latest'), 1);
        element.className = classNames.join(' ');
      });
    }

    messageDivs.forEach(function(currentDiv) {
      chatBoxElement.appendChild(currentDiv);
      // Class to start fade in animation
      currentDiv.className += ' load';
    });
    // Move chat to the most recent messages when new messages are added
    scrollToChatBottom();
  }
}

// Checks if the given typeValue matches with the user "name", the Watson "name", or neither
// Returns true if user, false if Watson, and null if neither
// Used to keep track of whether a message was from the user or Watson
function isUserMessage(typeValue) {
  if (typeValue === settings.authorTypes.user) {
    return true;
  } else if (typeValue === settings.authorTypes.watson) {
    return false;
  }
  return null;
}

// Constructs new DOM element from a message payload
function buildMessageDomElements(newPayload, isUser) {
  var textArray;
  if (isUser) {
    textArray = newPayload.text;
  } else if (newPayload.message) {
    textArray = newPayload.message.text;
  }

  if (textArray && Object.prototype.toString.call( textArray ) !== '[object Array]') {
    textArray = [textArray];
  }
  var messageArray = [];

  // display text (from both user and Watson)
  if (textArray) {
    textArray.forEach(function(currentText) {
      if (currentText) {
        var messageJson = {
          // <div class='segments'>
          'tagName': 'div',
          'classNames': ['segments'],
          'children': [{
            // <div class='from-user/from-watson latest'>
            'tagName': 'div',
            'classNames': [(isUser ? 'from-user' : 'from-watson'), 'latest', ((messageArray.length === 0) ? 'top' : 'sub')],
            'children': [{
              // <div class='message-inner'>
              'tagName': 'div',
              'classNames': ['message-inner'],
              'children': [{
                // <p>{messageText}</p>
                'tagName': 'p',
                'text': currentText
              }]
            }]
          }]
        };
        messageArray.push(Common.buildDomElement(messageJson));
      }
    });
  }

  if (!isUser)

  if (!isUser && newPayload.sender_action === 'typing_on') {
    // console.log(newPayload);
    var isTypingJson = {
      // <div class='segments'>
      'tagName': 'div',
      'attributes': [{
        name: 'id',
        value: 'typing-indicator',
      }],
      'children': [
        { 'tagName': 'span' },
        { 'tagName': 'span' },
        { 'tagName': 'span' },
      ]
    };
    messageArray.push(Common.buildDomElement(isTypingJson));
  } else if (!isUser && !newPayload.sender_action){
    // remove isTyping indicator
    var isTypingElement = document.getElementById('typing-indicator');
    isTypingElement.parentNode.removeChild(isTypingElement);
  }


  if (!isUser && newPayload.message && newPayload.message.quick_replies) {
    // display buttons sent by Watson
    var buttonNames = newPayload.message.quick_replies.map(function (qr) {
      return qr.payload;
    });

    for (var i=0; i < buttonNames.length; ++i) {
      var buttonName = buttonNames[i];
      var buttonJson = {
        // <div class='segments'>
        'tagName': 'div',
        'classNames': ['segments'],
        'children': [{
          // <div class='from-user/from-watson latest'>
          'tagName': 'div',
          'classNames': ['from-watson-button', 'latest'],
          'children': [{
            // <div class='message-inner'>
            'tagName': 'div',

            'classNames': ['message-inner'],
            'children': [{
              // <p>{messageText}</p>
              'tagName': 'p',
              'attributes': [{
                name: 'id',
                value: 'button',
              }],
              'text': buttonName
            }]
          }]
        }]
      };
      messageArray.push(Common.buildDomElement(buttonJson));
    }
  }

  return messageArray;
}

// Scroll to the bottom of the chat window (to the most recent messages)
// Note: this method will bring the most recent user message into view,
//   even if the most recent message is from Watson.
//   This is done so that the "context" of the conversation is maintained in the view,
//   even if the Watson message is long.
function scrollToChatBottom() {
  var scrollingChat = document.querySelector('#scrollingChat');

  // Scroll to the latest message sent by the user
  var scrollEl = scrollingChat.querySelector(settings.selectors.fromUser
          + settings.selectors.latest);
  if (scrollEl) {
    scrollingChat.scrollTop = scrollEl.offsetTop;
  }
}

// Handles the submission of input
function inputKeyDown(event, inputBox) {
  // Submit on enter key, dis-allowing blank messages
  if (event.keyCode === 13 && inputBox.value) {
    Api.sendRequest(inputBox.value);

    // Clear input box for further messages
    inputBox.value = '';
    Common.fireEvent(inputBox, 'input');
  }
}

var textInput = document.getElementById('textInput');
textInput.onkeydown = function(event) {
  inputKeyDown(event, textInput);
}

// textInput.onclick

function buttonClicked(event, button) {
  // if this is one of the latest buttons, send the request
  if (button.parentElement.parentElement.className.indexOf('latest') > -1) {
    var buttonName = button.innerHTML;
    Api.sendRequest(buttonName);
  }
}

document.onclick = function (event) {
  if (event.target.id === 'button') {
    buttonClicked(event, event.target)
  }
};

// Publicly accessible methods defined
module.exports = {
  init: init,
  inputKeyDown: inputKeyDown,
  buttonClicked: buttonClicked,
};
