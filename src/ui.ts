/**
 * What's New UI — Render changelog in popup/options/side panel
 */
import { ChangelogEntry } from './notifier';

const ICONS: Record<string, string> = { feature: '✨', fix: '🐛', improvement: '⚡', breaking: '🚨' };

export class WhatsNewUI {
    /** Render changelog entries into a container */
    static render(container: HTMLElement, entries: ChangelogEntry[], options?: { title?: string; onDismiss?: () => void }): void {
        container.innerHTML = '';
        container.style.cssText = 'font-family:-apple-system,sans-serif;max-width:500px;padding:20px;';

        // Header
        const header = document.createElement('div');
        header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;';
        const h2 = document.createElement('h2');
        h2.textContent = options?.title || "🆕 What's New";
        h2.style.cssText = 'margin:0;font-size:20px;';
        header.appendChild(h2);

        if (options?.onDismiss) {
            const closeBtn = document.createElement('button');
            closeBtn.textContent = '✕';
            closeBtn.style.cssText = 'all:unset;cursor:pointer;font-size:18px;color:#666;padding:4px 8px;';
            closeBtn.onclick = options.onDismiss;
            header.appendChild(closeBtn);
        }
        container.appendChild(header);

        // Entries
        entries.forEach((entry) => {
            const section = document.createElement('div');
            section.style.cssText = 'margin-bottom:16px;padding:12px;background:#f8f9fa;border-radius:8px;border-left:3px solid #1a73e8;';

            const versionRow = document.createElement('div');
            versionRow.style.cssText = 'display:flex;justify-content:space-between;margin-bottom:8px;';
            versionRow.innerHTML = `<strong style="font-size:14px">v${entry.version}</strong><span style="color:#666;font-size:12px">${entry.date}</span>`;
            section.appendChild(versionRow);

            entry.changes.forEach((change) => {
                const item = document.createElement('div');
                item.style.cssText = 'padding:4px 0;font-size:13px;color:#333;';
                item.textContent = `${ICONS[change.type] || '📦'} ${change.text}`;
                section.appendChild(item);
            });

            container.appendChild(section);
        });
    }

    /** Create a modal overlay with changelog */
    static showModal(entries: ChangelogEntry[], onDismiss?: () => void): void {
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:999999;';

        const modal = document.createElement('div');
        modal.style.cssText = 'background:white;border-radius:12px;max-height:80vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.3);';

        this.render(modal, entries, {
            onDismiss: () => { overlay.remove(); onDismiss?.(); },
        });

        overlay.appendChild(modal);
        overlay.onclick = (e) => { if (e.target === overlay) { overlay.remove(); onDismiss?.(); } };
        document.body.appendChild(overlay);
    }
}
