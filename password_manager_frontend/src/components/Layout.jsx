import { FiKey, FiGrid, FiLogOut, FiUser, FiZap, FiMenu, FiX, FiMoon, FiSun } from 'react-icons/fi';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from './Button';

const links = [
    { to: '/', label: 'Dashboard', icon: FiGrid },
    { to: '/vault', label: 'Vault', icon: FiKey },
    { to: '/generator', label: 'Generator', icon: FiZap },
    { to: '/profile', label: 'Profile', icon: FiUser }
  ];

export function Layout() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="min-h-screen">
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="relative z-50 w-72 max-w-[90vw] bg-(--sidebar-bg) backdrop-blur-xl p-4 md:p-6 shadow-2xl border-r border-(--border)">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="grid h-10 w-10 place-items-center rounded-lg brand-gradient text-white shrink-0">
                  <FiKey size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-base font-bold brand-text">VaultLock</p>
                  <p className="text-xs text-(--text-secondary)">Password Manager</p>
                </div>
              </div>
              <button className="rounded-md p-2 text-(--text-secondary) hover:bg-(--bg-hover) transition-colors shrink-0" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <FiX size={20} />
              </button>
            </div>
            <nav className="flex flex-col gap-2">
              {links.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${
                      isActive ? 'brand-gradient text-white shadow-lg' : 'text-(--text-secondary) hover:bg-(--bg-hover) hover:text-(--text-primary)'
                    }`
                  }
                >
                  <Icon size={18} />
                  {label}
                </NavLink>
              ))}
            </nav>
          </aside>
        </div>
      ) : null}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-(--border) bg-(--sidebar-bg) backdrop-blur-xl px-6 py-6 lg:block shadow-lg transition-colors duration-300">
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="grid h-12 w-12 place-items-center rounded-lg brand-gradient text-white shadow-lg shrink-0">
            <FiKey size={20} />
          </div>
          <div>
            <p className="text-base font-bold brand-text">VaultLock</p>
            <p className="text-xs text-(--text-secondary)">Password Manager</p>
          </div>
        </div>
        <nav className="space-y-2">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${
                  isActive ? 'brand-gradient text-white shadow-lg' : 'text-(--text-secondary) hover:bg-(--bg-hover) hover:text-(--text-primary)'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-(--border) bg-(--navbar-bg) backdrop-blur-xl px-3 py-2.5 md:px-6 lg:px-8 shadow-md transition-colors duration-300">
          <div className="flex items-center justify-between gap-2 md:gap-3 lg:gap-4">
            <div className="flex items-center gap-2 md:gap-3 min-w-0">
              <button className="lg:hidden rounded-md p-2 text-(--text-secondary) hover:bg-(--bg-hover) transition-colors shrink-0" onClick={() => setMobileOpen(true)} aria-label="Open menu">
                <FiMenu size={20} />
              </button>
              <div className='flex flex-col items-start gap-0.5 min-w-0'>
                <p className="text-xs md:text-sm text-(--text-secondary)">Account</p>
                <p className="font-semibold text-(--text-primary) truncate text-xs md:text-sm max-w-30 md:max-w-none">{user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
              <button
                onClick={toggleTheme}
                className="rounded-lg p-2 md:p-2.5 transition-all hover:bg-(--bg-hover) text-(--text-primary) hover:text-(--primary)"
                aria-label="Toggle theme"
                title={isDark ? 'Light mode' : 'Dark mode'}
              >
                {isDark ? <FiSun size={18} className="md:w-5 md:h-5" /> : <FiMoon size={18} className="md:w-5 md:h-5" />}
              </button>
              <Button variant="secondary" onClick={handleLogout} className="text-xs md:text-sm px-2 md:px-3 py-1.5 md:py-2">
                <FiLogOut size={16} className="md:w-4 md:h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}




