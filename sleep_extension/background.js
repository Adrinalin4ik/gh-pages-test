// Background service worker for Display Keep Awake extension

/**
 * States that the extension can be in.
 */
var StateEnum = {
  DISABLED: 'disabled',
  DISPLAY: 'display',
  SYSTEM: 'system'
};

/**
 * Key used for storing the current state in chrome.storage.local.
 */
var STATE_KEY = 'keepAwakeState';

/**
 * Loads the locally-saved state asynchronously.
 * @param {function} callback Callback invoked with the loaded {StateEnum}.
 */
function loadSavedState(callback) {
  chrome.storage.local.get(STATE_KEY, function(items) {
    var savedState = items[STATE_KEY];
    for (var key in StateEnum) {
      if (savedState == StateEnum[key]) {
        callback(savedState);
        return;
      }
    }
    // Default to DISPLAY state for kiosk mode
    callback(StateEnum.DISPLAY);
  });
}

/**
 * Switches to a new state.
 * @param {string} newState New {StateEnum} to use.
 */
function setState(newState) {
  var imagePrefix = 'night';
  var title = '';

  switch (newState) {
    case StateEnum.DISABLED:
      chrome.power.releaseKeepAwake();
      imagePrefix = 'night';
      title = 'Keep Awake: Disabled';
      break;
    case StateEnum.DISPLAY:
      chrome.power.requestKeepAwake('display');
      imagePrefix = 'day';
      title = 'Keep Awake: Display On';
      break;
    case StateEnum.SYSTEM:
      chrome.power.requestKeepAwake('system');
      imagePrefix = 'sunset';
      title = 'Keep Awake: System Awake';
      break;
    default:
      throw 'Invalid state "' + newState + '"';
  }

  var items = {};
  items[STATE_KEY] = newState;
  chrome.storage.local.set(items);

  chrome.action.setIcon({
    path: {
      '19': 'img/' + imagePrefix + '-19.png',
      '38': 'img/' + imagePrefix + '-38.png'
    }
  });
  chrome.action.setTitle({title: title});

  // Notify content scripts about state change
  notifyContentScripts('stateChanged', newState);
}

/**
 * Notify content scripts with state changes
 */
function notifyContentScripts(action, state = '') {
  console.log(`Notifying content scripts: ${action} - ${state}`);
  
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      const activeTab = tabs[0];
      
      // Skip chrome:// URLs and other restricted pages
      if (activeTab.url && (activeTab.url.startsWith('chrome://') || activeTab.url.startsWith('chrome-extension://'))) {
        console.log(`Skipping restricted tab: ${activeTab.url}`);
        return;
      }
      
      chrome.tabs.sendMessage(activeTab.id, { 
        action: action, 
        state: state 
      }).then(() => {
        console.log(`Successfully sent message to active tab ${activeTab.id}`);
      }).catch((error) => {
        console.log(`Failed to send message to active tab ${activeTab.id}:`, error.message);
      });
    }
  });
}

// Initialize extension state on install
chrome.runtime.onInstalled.addListener(() => {
  console.log('Display Keep Awake extension installed');
  // Set default state to DISPLAY for kiosk mode
  setState(StateEnum.DISPLAY);
});

// Handle extension startup
chrome.runtime.onStartup.addListener(() => {
  console.log('Display Keep Awake extension started');
  loadSavedState(function(state) { 
    setState(state); 
  });
});

// Handle action button clicks
chrome.action.onClicked.addListener(function() {
  loadSavedState(function(state) {
    switch (state) {
      case StateEnum.DISABLED:
        setState(StateEnum.DISPLAY);
        break;
      case StateEnum.DISPLAY:
        setState(StateEnum.SYSTEM);
        break;
      case StateEnum.SYSTEM:
        setState(StateEnum.DISABLED);
        break;
      default:
        setState(StateEnum.DISPLAY);
    }
  });
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background script received message:', message.action);
  
  if (message.action === 'pageLoaded') {
    console.log('Page loaded, checking current state');
    loadSavedState(function(state) {
      sendResponse({ success: true, state: state });
    });
    return true; // Keep message channel open for async response
  } else if (message.action === 'checkStatus') {
    loadSavedState(function(state) {
      sendResponse({ isActive: state !== StateEnum.DISABLED, state: state });
    });
    return true;
  } else if (message.action === 'getCurrentState') {
    loadSavedState(function(state) {
      sendResponse({ state: state });
    });
    return true;
  }
});

// Handle extension shutdown
chrome.runtime.onSuspend.addListener(() => {
  console.log('Display Keep Awake extension suspending');
  chrome.power.releaseKeepAwake();
});
