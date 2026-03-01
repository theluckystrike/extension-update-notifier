# extension-update-notifier — "What's New" for Chrome Extensions

[![npm](https://img.shields.io/npm/v/extension-update-notifier.svg)](https://www.npmjs.com/package/extension-update-notifier)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> **Built by [Zovo](https://zovo.one)** — used in all 18+ Zovo extensions

**Show beautiful changelog UI to users after extension updates.** Version detection, styled cards, modal overlay, and dismissal tracking.

## 📦 Install
```bash
npm install extension-update-notifier
```

## 🚀 Quick Start
```typescript
import { UpdateNotifier, WhatsNewUI } from 'extension-update-notifier';
const notifier = new UpdateNotifier({
  changelog: [
    { version: '2.1.0', date: '2025-01-15', changes: [
      { type: 'feature', text: 'Dark mode support' },
      { type: 'fix', text: 'Fixed memory leak' },
    ]},
  ],
});
notifier.init(); // In background
// In popup/options:
if (await notifier.hasPendingUpdate()) {
  const changes = notifier.getChangesSince('2.0.0');
  WhatsNewUI.showModal(changes, () => notifier.dismiss());
}
```

## 📄 License
MIT — [Zovo](https://zovo.one)
