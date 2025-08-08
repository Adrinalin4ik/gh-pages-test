// Background service worker for Display Keep Awake extension
let isKeepAwakeActive = false;

// Initialize extension state
chrome.runtime.onInstalled.addListener(() => {
  console.log('Display Keep Awake extension installed');
  // Automatically start keep awake
  startKeepAwake();
});

// Start keeping display awake
function startKeepAwake() {
  if (isKeepAwakeActive) return;
  
  try {
    // Check if chrome.power API is available
    if (typeof chrome.power === 'undefined') {
      console.error('chrome.power API is not available');
      notifyContentScripts('powerApiUnavailable', 'chrome.power API is not available');
      return;
    }
    
    chrome.power.requestKeepAwake("display");
    isKeepAwakeActive = true;
    
    console.log('Display keep awake activated');
    notifyContentScripts('keepAwakeEnabled');
    
  } catch (error) {
    console.error('Failed to activate keep awake:', error);
    isKeepAwakeActive = false;
    notifyContentScripts('powerApiError', error.message || error.toString());
  }
}

// Notify content scripts with different message types
function notifyContentScripts(action, errorMessage = '') {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, { 
        action: action, 
        errorMessage: errorMessage 
      }).catch(() => {
        // Tab might not be ready or content script not loaded
      });
    });
  });
}

// Handle extension startup
chrome.runtime.onStartup.addListener(() => {
  console.log('Display Keep Awake extension started');
  startKeepAwake();
});

// Handle extension shutdown
chrome.runtime.onSuspend.addListener(() => {
  console.log('Display Keep Awake extension suspending');
  if (isKeepAwakeActive) {
    stopKeepAwake();
  }
});

// Stop keeping display awake
function stopKeepAwake() {
  if (!isKeepAwakeActive) return;
  
  try {
    chrome.power.releaseKeepAwake();
    isKeepAwakeActive = false;
    
    console.log('Display keep awake deactivated');
  } catch (error) {
    console.error('Failed to deactivate keep awake:', error);
  }
}
