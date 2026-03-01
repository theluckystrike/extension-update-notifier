/**
 * Version Tracker — Track version history
 */
export class VersionTracker {
    static async getHistory(): Promise<Array<{ version: string; timestamp: number }>> {
        const result = await chrome.storage.local.get('__version_history__');
        return (result.__version_history__ as Array<{ version: string; timestamp: number }>) || [];
    }

    static async recordVersion(): Promise<void> {
        const history = await this.getHistory();
        const current = chrome.runtime.getManifest().version;
        if (!history.some((h) => h.version === current)) {
            history.push({ version: current, timestamp: Date.now() });
            await chrome.storage.local.set({ __version_history__: history });
        }
    }

    static async isFirstRun(): Promise<boolean> {
        const history = await this.getHistory();
        return history.length <= 1;
    }

    static async getPreviousVersion(): Promise<string | null> {
        const history = await this.getHistory();
        return history.length >= 2 ? history[history.length - 2].version : null;
    }
}
