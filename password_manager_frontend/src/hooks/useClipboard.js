import { useCallback, useState } from 'react';

export function useClipboard() {
  const [copied, setCopied] = useState('');

  const copy = useCallback(async (label, text) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    window.setTimeout(() => setCopied(''), 1500);
  }, []);

  return { copied, copy };
}

