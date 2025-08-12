# Installation Guide

## Quick Installation

1. **Open Chrome Extensions Page**
   - Go to `chrome://extensions/` in Chrome
   - Or click the three dots menu → More tools → Extensions

2. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top right corner

3. **Load the Extension**
   - Click "Load unpacked" button
   - Select the `sleep_extension` folder
   - The extension will appear in your extensions list

4. **Verify Installation**
   - You should see a new icon in your Chrome toolbar
   - The extension will automatically start in "Display" mode
   - Open `test.html` to verify it's working

## Testing the Extension

1. **Open the test page**
   - Open `sleep_extension/test.html` in Chrome
   - You should see status messages at the top of the page

2. **Test the functionality**
   - Click the extension icon to cycle through states
   - Watch for status messages on the test page
   - Try leaving the page idle - the screen should stay on

3. **Verify states**
   - **Night icon**: Disabled (normal power saving)
   - **Day icon**: Display mode (screen stays on)
   - **Sunset icon**: System mode (everything stays on)

## For Kiosk Mode

The extension is perfect for kiosk applications:

1. **Install the extension** using the steps above
2. **Set to "Display" or "System" mode** depending on your needs
3. **The setting will persist** across browser restarts
4. **No user interaction required** - it works automatically

## Troubleshooting

- **Extension not showing**: Make sure Developer mode is enabled
- **No status messages**: Check that the extension is enabled in chrome://extensions/
- **Screen still sleeps**: Try "System" mode instead of "Display" mode
- **Icon not changing**: Click the extension icon to cycle through states
