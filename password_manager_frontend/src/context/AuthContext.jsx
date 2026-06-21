import { createContext, useContext, useMemo, useState } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

const AuthContext = createContext(null);

function readUser() {
  const raw = localStorage.getItem('vaultlock_user');
  return raw ? JSON.parse(raw) : null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);
  const [token, setToken] = useState(() => localStorage.getItem('vaultlock_token'));

  function persist(session) {
    localStorage.setItem('vaultlock_token', session.token);
    localStorage.setItem('vaultlock_user', JSON.stringify(session.user));
    setToken(session.token);
    setUser(session.user);
  }

  async function login(credentials) {
    const session = await authService.login(credentials);
    persist(session);
  }

  async function register(payload) {
    const session = await authService.register(payload);
    persist(session);
  }

  function logout() {
    localStorage.removeItem('vaultlock_token');
    localStorage.removeItem('vaultlock_user');
    setToken(null);
    setUser(null);
  }

  async function updateProfile(payload) {
    const updated = await userService.updateProfile(payload);
    localStorage.setItem('vaultlock_user', JSON.stringify(updated));
    setUser(updated);
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
      updateProfile
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }
  return context;
}

