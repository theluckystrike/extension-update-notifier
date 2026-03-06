# extension-update-notifier

A TypeScript library for Chrome extensions that detects version updates via the chrome.runtime.onInstalled API and shows users a "What's New" changelog. Handles version comparison, update persistence in chrome.storage.local, UI rendering, modal overlays, dismissal tracking, and full version history.

Built for Manifest V3 service workers and content scripts.


INSTALLATION

```bash
npm install extension-update-notifier
```


REQUIREMENTS

- Chrome 90+ or Edge 90+
- Manifest V3 with "storage" permission
- TypeScript 5.x recommended


QUICK START

Set up the notifier in your background service worker.

```typescript
// background.ts
import { UpdateNotifier } from 'extension-update-notifier';

const notifier = new UpdateNotifier({
  changelog: [
    {
      version: '1.2.0',
      date: '2025-03-15',
      changes: [
        { type: 'feature', text: 'Added dark mode support' },
        { type: 'fix', text: 'Fixed popup rendering on high-DPI screens' },
        { type: 'improvement', text: 'Faster startup time' },
      ],
    },
  ],
  showOnMajor: true,
  showOnMinor: true,
  showOnPatch: false,
  onUpdate: (fromVersion, toVersion) => {
    console.log(`Updated from ${fromVersion} to ${toVersion}`);
  },
});

notifier.init();
```

Then show the changelog in your popup or options page.

```typescript
// popup.ts
import { UpdateNotifier, WhatsNewUI } from 'extension-update-notifier';

const notifier = new UpdateNotifier({ changelog });

const pending = await notifier.getPendingUpdate();
if (pending) {
  const entries = notifier.getChangesSince(pending.fromVersion);
  WhatsNewUI.showModal(entries, () => notifier.dismiss());
}
```


API REFERENCE

UpdateNotifier

The core class. Listens for chrome.runtime.onInstalled events and tracks pending updates in chrome.storage.local.

Constructor takes an UpdateConfig object.

```typescript
interface UpdateConfig {
  changelog: ChangelogEntry[];
  showOnMajor?: boolean;   // default true
  showOnMinor?: boolean;   // default true
  showOnPatch?: boolean;   // default false
  onUpdate?: (fromVersion: string, toVersion: string) => void;
}

interface ChangelogEntry {
  version: string;
  date: string;
  changes: Array<{
    type: 'feature' | 'fix' | 'improvement' | 'breaking';
    text: string;
  }>;
}
```

Methods on UpdateNotifier instances.

- init() - Register the onInstalled listener. Call once in your service worker.
- hasPendingUpdate() - Returns Promise<boolean>. True if the user has not dismissed the latest update notification.
- getPendingUpdate() - Returns Promise<{ fromVersion, toVersion } | null>.
- getChangesSince(version) - Returns all ChangelogEntry items newer than the given version.
- dismiss() - Clears the pending update from storage.

WhatsNewUI

Static methods for rendering changelog entries into the DOM.

- WhatsNewUI.render(container, entries, options?) - Renders changelog entries into a given HTMLElement. Options accept a title string and an onDismiss callback.
- WhatsNewUI.showModal(entries, onDismiss?) - Creates a full-screen modal overlay with the changelog. Clicking outside the modal or the close button triggers onDismiss.

VersionTracker

Static utility class for tracking the full version history of the extension.

- VersionTracker.recordVersion() - Stores the current version with a timestamp in chrome.storage.local if not already recorded.
- VersionTracker.getHistory() - Returns Promise<Array<{ version, timestamp }>>.
- VersionTracker.isFirstRun() - Returns true if the history contains one or zero entries.
- VersionTracker.getPreviousVersion() - Returns the second-to-last version string, or null.


MANIFEST CONFIGURATION

Your manifest.json needs the storage permission.

```json
{
  "manifest_version": 3,
  "background": {
    "service_worker": "background.js"
  },
  "permissions": ["storage"]
}
```


FULL EXAMPLE

```typescript
// background.ts
import { UpdateNotifier, VersionTracker } from 'extension-update-notifier';

const changelog = [
  {
    version: '2.0.0',
    date: '2025-06-01',
    changes: [
      { type: 'breaking', text: 'Dropped support for Manifest V2' },
      { type: 'feature', text: 'New side panel UI' },
    ],
  },
  {
    version: '1.1.0',
    date: '2025-04-10',
    changes: [
      { type: 'feature', text: 'Keyboard shortcuts' },
      { type: 'fix', text: 'Memory leak in content script' },
    ],
  },
];

const notifier = new UpdateNotifier({
  changelog,
  showOnMajor: true,
  showOnMinor: true,
  showOnPatch: false,
  onUpdate: (from, to) => {
    chrome.action.setBadgeText({ text: 'NEW' });
  },
});

notifier.init();
VersionTracker.recordVersion();
```

```typescript
// popup.ts
import { UpdateNotifier, WhatsNewUI, VersionTracker } from 'extension-update-notifier';

const notifier = new UpdateNotifier({ changelog });

const pending = await notifier.getPendingUpdate();
if (pending) {
  const entries = notifier.getChangesSince(pending.fromVersion);

  WhatsNewUI.showModal(entries, async () => {
    await notifier.dismiss();
    chrome.action.setBadgeText({ text: '' });
  });
}
```


CHANGE TYPES

The UI renders each change type with a visual indicator.

- feature - New functionality
- fix - Bug fix
- improvement - Enhancement to existing behavior
- breaking - Breaking change that may require user action


DEVELOPMENT

```bash
git clone https://github.com/theluckystrike/extension-update-notifier.git
cd extension-update-notifier
npm install
npm run build
npm run dev       # watch mode
npm test
npm run lint
```


LICENSE

MIT. See LICENSE file.


ABOUT

Built by theluckystrike. Part of the Zovo ecosystem at zovo.one.
