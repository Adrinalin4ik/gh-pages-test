// Background service worker for Display Keep Awake extension

// Log startup immediately when script loads
console.log('Display Keep Awake extension background script loaded');

// Initialize extension state
chrome.runtime.onInstalled.addListener(() => {
  console.log('Display Keep Awake extension installed');
  // Automatically start keep awake
  startKeepAwake();
});


// Start keeping display awake
function startKeepAwake(tabId = null) {
  console.log('Starting keep awake');
  try {
    // Check if chrome.power API is available
    if (typeof chrome.power === 'undefined') {
      console.error('chrome.power API is not available');
      notifyContentScripts('powerApiUnavailable', 'chrome.power API is not available', tabId);
      return;
    }
    
    chrome.power.requestKeepAwake("display");
    
    console.log('Display keep awake activated');
    notifyContentScripts('keepAwakeEnabled', '', tabId);
    
  } catch (error) {
    console.error('Failed to activate keep awake:', error);
    notifyContentScripts('powerApiError', error.message || error.toString(), tabId);
  }
}

// Notify content scripts with different message types
function notifyContentScripts(action, errorMessage = '', tabId = null) {
  console.log(`Attempting to notify content scripts with action: ${action}`);
  
  // If tabId is provided, send message to that specific tab
  if (tabId) {
    console.log(`Sending message to specific tab ${tabId}`);
    
    chrome.tabs.sendMessage(tabId, { 
      action: action, 
      errorMessage: errorMessage 
    }).then(() => {
      console.log(`Successfully sent message to tab ${tabId}`);
    }).catch((error) => {
      console.log(`Failed to send message to tab ${tabId}:`, error.message);
    });
    return;
  }
  
  // Otherwise, send to the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      const activeTab = tabs[0];
      
      // Skip chrome:// URLs and other restricted pages
      if (activeTab.url && (activeTab.url.startsWith('chrome://') || activeTab.url.startsWith('chrome-extension://'))) {
        console.log(`Skipping restricted tab: ${activeTab.url}`);
        return;
      }
      
      console.log(`Sending message to active tab ${activeTab.id}: ${activeTab.url}`);
      
      chrome.tabs.sendMessage(activeTab.id, { 
        action: action, 
        errorMessage: errorMessage 
      }).then(() => {
        console.log(`Successfully sent message to active tab ${activeTab.id}`);
      }).catch((error) => {
        console.log(`Failed to send message to active tab ${activeTab.id}:`, error.message);
      });
    } else {
      console.log('No active tab found');
    }
  });
}

// Handle extension startup
chrome.runtime.onStartup.addListener(() => {
  console.log('Display Keep Awake extension started');
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background script received message:', message.action);
  
  if (message.action === 'pageLoaded') {
    console.log('Page loaded, starting keep awake functionality');
    startKeepAwake(sender.tab.id);
    sendResponse({ success: true, message: 'Keep awake started' });
  } else if (message.action === 'checkStatus') {
    console.log('Status check requested');
    sendResponse({ isActive: true });
  } else if (message.action === 'testNotification') {
    console.log('Test notification requested');
    notifyContentScripts('extensionStarted', 'Test notification from background script', sender.tab.id);
    sendResponse({ success: true });
  }
});

// Handle extension shutdown
chrome.runtime.onSuspend.addListener(() => {
  console.log('Display Keep Awake extension suspending');
    stopKeepAwake();
});

// Stop keeping display awake
function stopKeepAwake() {
  
  try {
    chrome.power.releaseKeepAwake();
    
    console.log('Display keep awake deactivated');
  } catch (error) {
    console.error('Failed to deactivate keep awake:', error);
  }
}
