# extension-update-notifier

Check for extension updates and notify users with changelog information.

## Overview

extension-update-notifier helps Chrome extensions check for updates and display meaningful notification to users about what's new in the latest version.

## Installation

```bash
npm install extension-update-notifier
```

## Usage

### Basic Setup

```javascript
import { UpdateNotifier } from 'extension-update-notifier';

const notifier = new UpdateNotifier({
  repo: 'yourusername/your-extension',
  currentVersion: '1.0.0',
});

notifier.checkForUpdates();
```

### With Custom Notification

```javascript
import { UpdateNotifier } from 'extension-update-notifier';

const notifier = new UpdateNotifier({
  repo: 'yourusername/your-extension',
  currentVersion: '1.0.0',
  notificationType: 'popup',  // 'popup', 'badge', 'notification'
});

notifier.on('update-available', (info) => {
  console.log(`New version ${info.version} available!`);
  console.log(`Changes: ${info.changelog}`);
});

notifier.checkForUpdates();
```

### With User Notification

```javascript
notifier.on('update-available', async (info) => {
  // Show browser notification
  new Notification('Update Available', {
    body: `Version ${info.version} is now available!`,
    icon: '/images/icon.png',
  });
  
  // Or update badge
  chrome.runtime.requestUpdateCheck();
});
```

## API

### UpdateNotifier Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| repo | string | yes | GitHub repo (user/repo) |
| currentVersion | string | yes | Current extension version |
| notificationType | string | no | How to notify (popup/badge/notification) |
| checkInterval | number | no | Hours between checks (default: 24) |

### Events

- `update-available` - New version available
- `up-to-date` - Already on latest version
- `error` - Error checking for updates

### Methods

- `checkForUpdates()` - Manually check for updates
- `getReleaseNotes()` - Get changelog for latest version

## Manifest Configuration

In your `manifest.json`:

```json
{
  "background": {
    "service_worker": "background.js"
  },
  "permissions": ["storage"]
}
```

## Example: Full Implementation

```javascript
// background.js
import { UpdateNotifier } from 'extension-update-notifier';

const notifier = new UpdateNotifier({
  repo: 'yourusername/your-extension',
  currentVersion: chrome.runtime.getManifest().version,
  checkInterval: 12,  // Check every 12 hours
});

// Listen for updates
notifier.on('update-available', (info) => {
  // Store update info for popup to display
  chrome.storage.local.set({ 
    availableUpdate: info 
  });
  
  // Update badge to show update is available
  chrome.action.setBadgeText({ text: '!' });
  chrome.action.setBadgeBackgroundColor({ color: '#4CAF50' });
});

// Check on startup
notifier.checkForUpdates();
```

## Browser Support

- Chrome 90+
- Edge 90+

## License

MIT
