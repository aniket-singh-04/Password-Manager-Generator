import { FiCopy, FiRefreshCw } from 'react-icons/fi';
import { useState } from 'react';
import { Button } from '../components/Button';
import { useClipboard } from '../hooks/useClipboard';
import { generatePassword, getPasswordStrength } from '../utils/password';

const defaultOptions = {
  length: 18,
  uppercase: true,
  lowercase: true,
  numbers: true,
  special: true
};

export function Generator() {
  const [options, setOptions] = useState(defaultOptions);
  const [password, setPassword] = useState(() => generatePassword(defaultOptions));
  const { copied, copy } = useClipboard();
  const strength = getPasswordStrength(password);

  function updateOptions(updater) {
    setOptions((current) => {
      const next = typeof updater === 'function' ? updater(current) : updater;
      setPassword(generatePassword(next));
      return next;
    });
  }

  function toggle(field) {
    updateOptions((current) => ({ ...current, [field]: !current[field] }));
  }

  return (
    <section className="grid max-w-3xl gap-6">
      <div>
        <h1 className="page-title text-4xl">Password Generator</h1>
        <p className="mt-1 text-(-text-secondary)">Create strong credentials with configurable character sets.</p>
      </div>

      <div className="app-card rounded-lg p-6">
        <div className="monospace-result rounded-lg p-5">
          <p className="break-all font-mono text-lg font-bold text-white">{password || 'Select at least one character set'}</p>
        </div>
        <div className="meter-bg mt-4 h-3 overflow-hidden rounded-full">
          <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: `${strength.value}%` }} />
        </div>
        <p className="mt-2 text-sm font-semibold text-(-text-secondary)">Strength: <span className="text-(-secondary) font-bold">{strength.label}</span></p>

        <div className="mt-6 grid gap-5">
          <label>
            <span className="mb-2 block text-sm font-semibold text-(-text-primary)">Length: <span className="text-(-primary)">{options.length}</span></span>
            <input
              type="range"
              min="8"
              max="64"
              value={options.length}
              onChange={(event) => updateOptions((current) => ({ ...current, length: Number(event.target.value) }))}
              className="w-full accent--primary)"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ['uppercase', 'Uppercase letters'],
              ['lowercase', 'Lowercase letters'],
              ['numbers', 'Numbers'],
              ['special', 'Special characters']
            ].map(([field, label]) => (
              <label key={field} className="choice-tile flex items-center gap-3 rounded-lg p-3 cursor-pointer transition-all">
                <input
                  type="checkbox"
                  checked={options[field]}
                  onChange={() => toggle(field)}
                  className="h-5 w-5 accent--primary) cursor-pointer"
                />
                <span className="text-sm font-semibold text-(-text-primary)">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button onClick={() => setPassword(generatePassword(options))}>
            <FiRefreshCw />
            Regenerate
          </Button>
          <Button variant="secondary" onClick={() => copy('password', password)} disabled={!password}>
            <FiCopy />
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>
      </div>
    </section>
  );
}
