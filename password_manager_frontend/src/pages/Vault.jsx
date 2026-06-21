import { FiPlus, FiSearch } from 'react-icons/fi';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '../components/Button';
import { PasswordCard } from '../components/PasswordCard';
import { PasswordForm } from '../components/PasswordForm';
import { useClipboard } from '../hooks/useClipboard';
import { vaultService } from '../services/vaultService';
import { getApiError } from '../utils/errors';

export function Vault() {
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { copied, copy } = useClipboard();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      vaultService.list(search).then(setEntries).catch((err) => setError(getApiError(err)));
    }, 200);
    return () => window.clearTimeout(timeout);
  }, [search]);

  const title = useMemo(() => (editing ? 'Edit password' : 'Add password'), [editing]);

  async function handleSubmit(payload) {
    setError('');
    setSubmitting(true);
    try {
      const saved = editing
        ? await vaultService.update(editing.id, payload)
        : await vaultService.create(payload);
      setEntries((current) => {
        const others = current.filter((entry) => entry.id !== saved.id);
        return [saved, ...others];
      });
      setShowForm(false);
      setEditing(null);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm('Delete this password entry?');
    if (!confirmed) return;
    await vaultService.remove(id);
    setEntries((current) => current.filter((entry) => entry.id !== id));
  }

  function startCreate() {
    setEditing(null);
    setShowForm(true);
  }

  function startEdit(entry) {
    setEditing(entry);
    setShowForm(true);
  }

  return (
    <section className="grid gap-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="page-title text-4xl">Password Vault</h1>
          <p className="mt-1 text-(-text-secondary)">Create, search, edit, copy, and delete saved credentials.</p>
        </div>
        <Button onClick={startCreate}>
          <FiPlus />
          Add password
        </Button>
      </div>

      <label className="relative block">
        <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(-secondary)" size={20} />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by website, URL, username, or notes"
          className="soft-input w-full rounded-lg py-3 pl-10 pr-4 text-sm shadow-md focus:outline-none transition-all hover:border--primary)"
        />
      </label>

      {error ? <div className="alert-danger rounded-lg p-4 text-sm font-semibold">{error}</div> : null}

      {showForm ? (
        <div className="app-card rounded-lg p-6">
          <h2 className="mb-4 text-2xl font-bold text-(-text-primary)">{title}</h2>
          <PasswordForm
            key={editing?.id ?? 'new'}
            entry={editing}
            submitting={submitting}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditing(null);
            }}
          />
        </div>
      ) : null}

      <div className="grid gap-4">
        {entries.length ? (
          entries.map((entry) => (
            <PasswordCard
              key={entry.id}
              entry={entry}
              copied={copied}
              onCopy={copy}
              onEdit={startEdit}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="app-panel rounded-lg border-2 border-dashed p-8 text-center">
            <p className="text-(-text-secondary) font-medium">No matching passwords found.</p>
          </div>
        )}
      </div>
    </section>
  );
}

