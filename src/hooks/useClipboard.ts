import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_CLEAR_MS = 30_000;

export function useClipboard(clearAfterMs = DEFAULT_CLEAR_MS) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const copy = useCallback(
    async (value: string, fieldId: string) => {
      clearTimer();
      await navigator.clipboard.writeText(value);
      setCopiedField(fieldId);

      timerRef.current = window.setTimeout(async () => {
        try {
          const current = await navigator.clipboard.readText();
          if (current === value) {
            await navigator.clipboard.writeText("");
          }
        } catch {
          /* Clipboard read may be blocked; best-effort clear only */
        }
        setCopiedField((current) => (current === fieldId ? null : current));
      }, clearAfterMs);
    },
    [clearAfterMs, clearTimer],
  );

  useEffect(() => () => clearTimer(), [clearTimer]);

  return { copiedField, copy };
}
