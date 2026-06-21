import { FiClock, FiKey, FiPlus, FiShield } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { StatCard } from '../components/StatCard';
import { vaultService } from '../services/vaultService';
import { getApiError } from '../utils/errors';

export function Dashboard() {
  const [stats, setStats] = useState({ totalPasswords: 0, recentlyAdded: [] });
  const [error, setError] = useState('');

  useEffect(() => {
    vaultService.stats().then(setStats).catch((err) => setError(getApiError(err)));
  }, []);

  return (
    <section className="grid gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="page-title text-4xl">Dashboard</h1>
          <p className="mt-1 text-(-text-secondary)">Your vault overview and recent activity.</p>
        </div>
        <Link to="/vault" className="brand-gradient inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 shadow-lg">
          <FiPlus />
          Add password
        </Link>
      </div>

      {error ? <div className="alert-danger rounded-lg p-4 text-sm font-semibold">{error}</div> : null}

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total passwords" value={stats.totalPasswords} icon={FiKey} color="var(--primary)" />
        <StatCard label="Recently added" value={stats.recentlyAdded.length} icon={FiClock} color="var(--secondary)" />
        <StatCard label="Protected account" value="AES-256" icon={FiShield} color="var(--accent)" />
      </div>

      <div className="app-card rounded-lg p-6 transition-all">
        <div className="mb-4 flex items-center gap-3">
          <div className="p-2.5 bg--surface-soft) rounded-lg border border-(-border)">
            <FiClock size={20} className="text-(-secondary)" />
          </div>
          <h2 className="text-lg font-bold text-(-text-primary)">Recently added passwords</h2>
        </div>
        {stats.recentlyAdded.length ? (
          <div className="grid gap-3">
            {stats.recentlyAdded.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between gap-3 rounded-lg bg-(-surface-soft) p-4 border border-)-border) hover:border-(-primary) transition-all hover:shadow-md">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-(-text-primary)">{entry.websiteName}</p>
                  <p className="truncate text-sm text-(-text-secondary)">{entry.username}</p>
                </div>
                <div className="shrink-0 p-2 bg-(-surface) rounded-lg border border-(-border)">
                  <FiKey size={18} className="text-(-primary)" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-(-text-secondary)">No passwords saved yet.</p>
        )}
      </div>
    </section>
  );
}
