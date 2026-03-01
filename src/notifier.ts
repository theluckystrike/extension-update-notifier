/**
 * Update Notifier — Detect updates and show changelog
 */
export interface ChangelogEntry {
    version: string;
    date: string;
    changes: Array<{ type: 'feature' | 'fix' | 'improvement' | 'breaking'; text: string }>;
}

export interface UpdateConfig {
    changelog: ChangelogEntry[];
    showOnMajor?: boolean;
    showOnMinor?: boolean;
    showOnPatch?: boolean;
    onUpdate?: (fromVersion: string, toVersion: string) => void;
}

export class UpdateNotifier {
    private config: UpdateConfig;

    constructor(config: UpdateConfig) {
        this.config = {
            showOnMajor: true,
            showOnMinor: true,
            showOnPatch: false,
            ...config,
        };
    }

    /** Initialize — call in background service worker */
    init(): void {
        chrome.runtime.onInstalled.addListener(async (details) => {
            if (details.reason === 'update' && details.previousVersion) {
                const currentVersion = chrome.runtime.getManifest().version;
                const shouldShow = this.shouldShowChangelog(details.previousVersion, currentVersion);

                if (shouldShow) {
                    await chrome.storage.local.set({
                        __update_pending__: {
                            fromVersion: details.previousVersion,
                            toVersion: currentVersion,
                            timestamp: Date.now(),
                        },
                    });
                    this.config.onUpdate?.(details.previousVersion, currentVersion);
                }
            }

            if (details.reason === 'install') {
                await chrome.storage.local.set({
                    __first_install__: { version: chrome.runtime.getManifest().version, timestamp: Date.now() },
                });
            }
        });
    }

    /** Check if there's a pending update to show */
    async hasPendingUpdate(): Promise<boolean> {
        const result = await chrome.storage.local.get('__update_pending__');
        return !!result.__update_pending__;
    }

    /** Get pending update info */
    async getPendingUpdate(): Promise<{ fromVersion: string; toVersion: string } | null> {
        const result = await chrome.storage.local.get('__update_pending__');
        return result.__update_pending__ || null;
    }

    /** Get changelog entries since a version */
    getChangesSince(version: string): ChangelogEntry[] {
        return this.config.changelog.filter((entry) => this.compareVersions(entry.version, version) > 0);
    }

    /** Mark as seen */
    async dismiss(): Promise<void> {
        await chrome.storage.local.remove('__update_pending__');
    }

    private shouldShowChangelog(from: string, to: string): boolean {
        const [fromMajor, fromMinor] = from.split('.').map(Number);
        const [toMajor, toMinor] = to.split('.').map(Number);
        if (toMajor > fromMajor) return !!this.config.showOnMajor;
        if (toMinor > fromMinor) return !!this.config.showOnMinor;
        return !!this.config.showOnPatch;
    }

    private compareVersions(a: string, b: string): number {
        const pa = a.split('.').map(Number);
        const pb = b.split('.').map(Number);
        for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
            const na = pa[i] || 0;
            const nb = pb[i] || 0;
            if (na > nb) return 1;
            if (na < nb) return -1;
        }
        return 0;
    }
}
