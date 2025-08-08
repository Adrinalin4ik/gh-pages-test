// Content script for Display Keep Awake extension
console.log('Display Keep Awake extension content script loaded');

// Function to show the sleep extension enabled message
function showSleepExtensionMessage() {
  // Create the message element
  const message = document.createElement('div');
  message.style.cssText = `
    position: fixed;
    top: 20px;
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
    animation: fadeInOutTop 5s ease-in-out;
  `;
  
  message.textContent = '🖥️ Sleep Extension Enabled';
  
  // Add CSS animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInOutTop {
      0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
      10% { opacity: 1; transform: translateX(-50%) translateY(0); }
      80% { opacity: 1; transform: translateX(-50%) translateY(0); }
      100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
    }
  `;
  document.head.appendChild(style);
  
  // Add message to page
  document.body.appendChild(message);
  
  // Remove message after 5 seconds
  setTimeout(() => {
    if (message.parentElement) {
      message.parentElement.removeChild(message);
    }
    if (style.parentElement) {
      style.parentElement.removeChild(style);
    }
  }, 120000);
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'keepAwakeEnabled') {
    showSleepExtensionMessage();
  }
});

// Show message when content script loads (if extension is already active)
setTimeout(() => {
  showSleepExtensionMessage();
}, 1000); // Show after 1 second to ensure page is loaded
