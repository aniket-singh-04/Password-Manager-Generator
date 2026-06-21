import { FiKey } from 'react-icons/fi';
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuth } from '../context/AuthContext';
import { getApiError } from '../utils/errors';

export function AuthPage({ mode }) {
  const isRegister = mode === 'register';
  const navigate = useNavigate();
  const { isAuthenticated, login, register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await register(form);
      } else {
        await login({ email: form.email, password: form.password });
      }
      navigate('/', { replace: true });
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-shell grid min-h-screen place-items-center px-4 py-8">
      <section className="app-card w-full max-w-md rounded-2xl p-8 backdrop-blur-xl relative z-10">
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="grid h-14 w-14 place-items-center rounded-lg brand-gradient text-white shadow-lg">
            <FiKey size={24} />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-extrabold brand-text">{isRegister ? 'Create your vault' : 'Welcome back'}</h1>
            <p className="text-sm text-(--text-secondary)">VaultLock keeps your credentials organized.</p>
          </div>
        </div>

        {error ? <div className="alert-danger mb-4 rounded-lg px-4 py-3 text-sm font-semibold">{error}</div> : null}

        <form className="grid gap-4" onSubmit={handleSubmit}>
          {isRegister ? <Input label="Name" value={form.name} onChange={(event) => update('name', event.target.value)} required /> : null}
          <Input label="Email" type="email" value={form.email} onChange={(event) => update('email', event.target.value)} required />
          <Input label="Password" type="password" value={form.password} onChange={(event) => update('password', event.target.value)} minLength={10} required />
          <Button type="submit" disabled={loading}>{loading ? 'Please wait...' : isRegister ? 'Register' : 'Login'}</Button>
        </form>

        <p className="mt-6 text-center text-sm text-(--text-secondary)">
          {isRegister ? 'Already have an account?' : 'New to VaultLock?'}{' '}
          <Link className="font-bold text-(--primary) hover:text-(--primary-600) transition-all" to={isRegister ? '/login' : '/register'}>
            {isRegister ? 'Login' : 'Create an account'}
          </Link>
        </p>
      </section>
    </main>
  );
}
