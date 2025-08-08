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
    chrome.power.requestKeepAwake("display");
    isKeepAwakeActive = true;
    
    console.log('Display keep awake activated');
    
    // Notify all content scripts that keep awake is active
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, { action: 'keepAwakeEnabled' }).catch(() => {
          // Tab might not be ready or content script not loaded
        });
      });
    });
    
  } catch (error) {
    console.error('Failed to activate keep awake:', error);
    isKeepAwakeActive = false;
  }
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
