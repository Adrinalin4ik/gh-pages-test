# Display Keep Awake Chrome Extension

A simple Chrome extension that prevents your display from sleeping using the `chrome.power.requestKeepAwake("display")` API.

## Features

- **Automatic Activation**: The extension automatically activates when installed
- **Display Prevention**: Uses Chrome's power API to prevent display sleep
- **Simple Notification**: Shows a 5-second message when enabled
- **No UI**: Minimal interface - just works in the background

## Installation

1. **Load the Extension**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `sleep_extension` folder

2. **Grant Permissions**:
   - The extension will request "power" permission
   - Click "Allow" when prompted

## How It Works

- **Background Script**: Uses `chrome.power.requestKeepAwake("display")` to prevent sleep
- **Content Script**: Shows a 5-second notification message on web pages
- **Automatic**: No user interaction required - works immediately after installation

## Files

- `manifest.json` - Extension configuration
- `background.js` - Background service worker (handles power API)
- `content.js` - Content script (shows notification message)
- `README.md` - This documentation

## Usage

Once installed, the extension will:
1. Automatically activate when Chrome starts
2. Prevent your display from sleeping
3. Show a "🖥️ Sleep Extension Enabled" message for 5 seconds on web pages
4. Continue working in the background

## Technical Details

- **Manifest Version**: 3 (latest Chrome extension format)
- **Permissions**: `power` (required for keep awake functionality)
- **Background**: Service worker for power management
- **Content Scripts**: Runs on all URLs to show notification

## Notes

- The extension calls `chrome.power.requestKeepAwake("display")` once when installed
- Works on all websites
- No popup or settings UI - just works silently
- The notification message appears once per page load
