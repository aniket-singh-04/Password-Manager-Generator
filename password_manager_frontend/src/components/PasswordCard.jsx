import { FiCopy, FiEdit2, FiExternalLink, FiEye, FiEyeOff, FiTrash2 } from 'react-icons/fi';
import { useState } from 'react';
import { Button } from './Button';

export function PasswordCard({ entry, copied, onCopy, onEdit, onDelete }) {
  const [visible, setVisible] = useState(false);

  return (
    <article className="app-card rounded-lg p-5 transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="h-6 w-1 rounded-full brand-gradient"></div>
            <h3 className="truncate text-lg font-bold text-(--text-primary)">{entry.websiteName}</h3>
          </div>
          {entry.websiteUrl ? (
            <a href={entry.websiteUrl} target="_blank" rel="noreferrer" className="mt-1 inline-flex max-w-full items-center gap-2 truncate text-sm font-medium text-(--primary) hover:text-(--primary-600) hover:underline">
              <FiExternalLink size={14} />
              {entry.websiteUrl}
            </a>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" title="Edit" onClick={() => onEdit(entry)}>
            <FiEdit2 />
            Edit
          </Button>
          <Button variant="danger" title="Delete" onClick={() => onDelete(entry.id)}>
            <FiTrash2 />
          </Button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-lg bg-(--surface-soft) p-4 border border-(--border)">
          <p className="text-xs font-semibold uppercase text-(--secondary)">Username</p>
          <div className="mt-2 flex items-center justify-between gap-2">
            <p className="truncate text-sm font-semibold text-(--text-primary)">{entry.username}</p>
            <button className="rounded-md p-2 text-(--text-secondary) hover:bg-(--surface) hover:text-(--primary) transition-colors" title="Copy username" onClick={() => onCopy('username', entry.username)}>
              <FiCopy />
            </button>
          </div>
        </div>
        <div className="rounded-lg bg-(--surface-soft) p-4 border border-(--border)">
          <p className="text-xs font-semibold uppercase text-(--accent)">Password</p>
          <div className="mt-2 flex items-center justify-between gap-2">
            <p className="truncate text-sm font-semibold text-(--text-primary)">{visible ? entry.password : '************'}</p>
            <div className="flex">
              <button className="rounded-md p-2 text-(--text-secondary) hover:bg-(--surface) hover:text-(--accent) transition-colors" title="Toggle visibility" onClick={() => setVisible((current) => !current)}>
                {visible ? <FiEyeOff /> : <FiEye />}
              </button>
              <button className="rounded-md p-2 text-(--text-secondary) hover:bg-(--surface) hover:text-(--accent) transition-colors" title="Copy password" onClick={() => onCopy('password', entry.password)}>
                <FiCopy />
              </button>
            </div>
          </div>
        </div>
      </div>

      {entry.notes ? <p className="mt-3 rounded-md bg-(--surface-soft) p-3 text-sm text-(--text-primary) border border-(--border)">{entry.notes}</p> : null}
      {copied ? <p className="mt-3 text-sm font-semibold text-(--success)">Copied {copied}.</p> : null}
    </article>
  );
}
