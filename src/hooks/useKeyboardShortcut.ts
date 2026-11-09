import { useEffect } from 'react';

type KeyCombo = {
  key: string;
  ctrlOrMeta?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
};

export function useKeyboardShortcut(
  combo: KeyCombo,
  callback: (e: KeyboardEvent) => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handler = (e: KeyboardEvent) => {
      const isCtrlOrMeta = e.metaKey || e.ctrlKey;
      const keyMatches = e.key.toLowerCase() === combo.key.toLowerCase();

      if (combo.ctrlOrMeta && !isCtrlOrMeta) return;
      if (!combo.ctrlOrMeta && isCtrlOrMeta && combo.key !== 'k' && combo.key !== 'n') return;
      if (combo.altKey && !e.altKey) return;
      if (combo.shiftKey && !e.shiftKey) return;

      if (keyMatches) {
        if (combo.ctrlOrMeta) {
          e.preventDefault();
        }
        callback(e);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [combo, callback, enabled]);
}

