// Content script for Display Keep Awake extension
console.log('Display Keep Awake extension content script loaded');

chrome.runtime.sendMessage({ action: 'pageLoaded' }, (response) => {
  if (chrome.runtime.lastError) {
    console.log('Content script: Error sending pageLoaded message:', chrome.runtime.lastError.message);
  } else {
    console.log('Content script: PageLoaded message sent successfully');
  }
});

// Global variable to track active messages
let activeMessages = [];

// Function to show the sleep extension enabled message
function showSleepExtensionMessage(message = '🖥️ Sleep Extension Enabled', duration = 10000) {
  // Create the message element
  const messageElement = document.createElement('div');
  const messageId = Date.now() + Math.random();
  messageElement.dataset.messageId = messageId;
  
  // Calculate position based on number of active messages
  const topOffset = 20 + (activeMessages.length * 70); // 70px spacing between messages
  
  messageElement.style.cssText = `
    position: fixed;
    top: ${topOffset}px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    font-family: Arial, sans-serif;
    font-size: 14px;
    font-weight: 500;
    z-index: 1000000;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    animation: fadeInOutTop ${duration}ms ease-in-out;
    max-width: 80%;
    word-wrap: break-word;
    transition: top 0.3s ease;
  `;
  
  messageElement.textContent = message;
  
  // Add CSS animation if not already added
  if (!document.getElementById('sleep-extension-styles')) {
    const style = document.createElement('style');
    style.id = 'sleep-extension-styles';
    style.textContent = `
      @keyframes fadeInOutTop {
        0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        10% { opacity: 1; transform: translateX(-50%) translateY(0); }
        80% { opacity: 1; transform: translateX(-50%) translateY(0); }
        100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Add message to page
  document.body.appendChild(messageElement);
  
  // Add to active messages array
  activeMessages.push(messageId);
  
  // Remove message after specified duration
  setTimeout(() => {
    removeMessage(messageId);
  }, duration);
  
  return messageId;
}

// Function to remove a specific message
function removeMessage(messageId) {
  const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
  if (messageElement && messageElement.parentElement) {
    messageElement.parentElement.removeChild(messageElement);
  }
  
  // Remove from active messages array
  activeMessages = activeMessages.filter(id => id !== messageId);
  
  // Reposition remaining messages
  repositionMessages();
}

// Function to reposition all active messages
function repositionMessages() {
  const messageElements = document.querySelectorAll('[data-message-id]');
  messageElements.forEach((element, index) => {
    const topOffset = 20 + (index * 70);
    element.style.top = `${topOffset}px`;
  });
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Content script received message:', request.action);
  
  if (request.action === 'extensionStarted') {
    showSleepExtensionMessage('🖥️ Sleep Extension Started', 5000);
  } else if (request.action === 'keepAwakeEnabled') {
    showSleepExtensionMessage('🖥️ Sleep Extension Enabled', 10000);
  } else if (request.action === 'powerApiUnavailable') {
    showSleepExtensionMessage(`⚠️ Power API Unavailable: ${request.errorMessage}`, 10000);
  } else if (request.action === 'powerApiError') {
    showSleepExtensionMessage(`❌ Power API Error: ${request.errorMessage}`, 10000);
  }
});
