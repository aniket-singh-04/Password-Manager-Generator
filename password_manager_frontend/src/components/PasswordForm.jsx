import { useState } from 'react';
import { FiCopy, FiRefreshCw, FiSave } from 'react-icons/fi';
import { Button } from './Button';
import { Input } from './Input';
import { generatePassword, getPasswordStrength } from '../utils/password';

const initialState = {
  websiteName: '',
  websiteUrl: '',
  username: '',
  password: '',
  notes: ''
};

export function PasswordForm({ entry, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(entry || initialState);
  const [generatorOptions, setGeneratorOptions] = useState({
    length: 18,
    uppercase: true,
    lowercase: true,
    numbers: true,
    special: true
  });
  const [copied, setCopied] = useState(false);
  const strength = getPasswordStrength(form.password);


  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(form);
  }

  function handleGenerate() {
    update('password', generatePassword(generatorOptions));
    setCopied(false);
  }

  function toggleGeneratorOption(field) {
    setGeneratorOptions((current) => ({ ...current, [field]: !current[field] }));
  }

  async function copyPassword() {
    if (!form.password) return;
    await navigator.clipboard.writeText(form.password);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-lg app-panel p-6 shadow-lg">
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Website name" value={form.websiteName} onChange={(event) => update('websiteName', event.target.value)} required />
        <Input label="Website URL" type="url" value={form.websiteUrl} onChange={(event) => update('websiteUrl', event.target.value)} placeholder="https://example.com" required />
        <Input label="Username or email" value={form.username} onChange={(event) => update('username', event.target.value)} required />
        <Input label="Password" value={form.password} onChange={(event) => update('password', event.target.value)} required />
      </div>

      <section className="rounded-lg app-panel p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-base font-bold text-(--text-primary)">Generate password</h3>
            <p className="mt-1 text-sm text-(--text-secondary)">Customize a secure password and use it for this entry.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" onClick={handleGenerate}>
              <FiRefreshCw />
              Generate
            </Button>
            <Button type="button" variant="secondary" onClick={copyPassword} disabled={!form.password}>
              <FiCopy />
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </div>

        <div className="mt-4 grid gap-4">
          <label>
            <span className="mb-2 block text-sm font-semibold text-(--text-primary)">Length: <span className="text-(--primary) font-bold">{generatorOptions.length}</span></span>
            <input
              type="range"
              min="8"
              max="64"
              value={generatorOptions.length}
              onChange={(event) => setGeneratorOptions((current) => ({ ...current, length: Number(event.target.value) }))}
              className="w-full accent-(--primary)"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['uppercase', 'Uppercase'],
              ['lowercase', 'Lowercase'],
              ['numbers', 'Numbers'],
              ['special', 'Symbols']
            ].map(([field, label]) => (
              <label key={field} className="choice-tile flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 cursor-pointer transition-all">
                <input
                  type="checkbox"
                  checked={generatorOptions[field]}
                  onChange={() => toggleGeneratorOption(field)}
                  className="h-4 w-4 accent-(--primary) cursor-pointer"
                />
                <span className="text-sm font-semibold text-(--text-primary)">{label}</span>
              </label>
            ))}
          </div>

          <div>
            <div className="meter-bg h-3 overflow-hidden rounded-full">
              <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: `${strength.value}%` }} />
            </div>
            <p className="mt-2 text-sm font-semibold text-(--text-secondary)">Strength: <span className="text-(--primary)">{form.password ? strength.label : 'No password yet'}</span></p>
          </div>
        </div>
      </section>

      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-(--text-primary)">Notes</span>
        <textarea
          value={form.notes}
          onChange={(event) => update('notes', event.target.value)}
          className="soft-input min-h-24 w-full rounded-lg px-4 py-3 text-sm shadow-sm focus:outline-none transition-all hover:border-(--primary)"
        />
      </label>
      <div className="flex flex-wrap justify-end gap-2">
        {onCancel ? (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" disabled={submitting}>
          <FiSave />
          {entry ? 'Save changes' : 'Add password'}
        </Button>
      </div>
    </form>
  );
}