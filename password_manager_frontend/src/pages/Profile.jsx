import { useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { getApiError } from '../utils/errors';

export function Profile() {
  const { user, updateProfile } = useAuth();
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function saveProfile(event) {
    event.preventDefault();
    setMessage('');
    setError('');
    try {
      await updateProfile(profile);
      setMessage('Profile updated.');
    } catch (err) {
      setError(getApiError(err));
    }
  }

  async function changePassword(event) {
    event.preventDefault();
    setMessage('');
    setError('');
    try {
      await userService.changePassword(passwords);
      setPasswords({ currentPassword: '', newPassword: '' });
      setMessage('Password changed.');
    } catch (err) {
      setError(getApiError(err));
    }
  }

  return (
    <section className="grid max-w-4xl gap-6">
      <div>
        <h1 className="page-title text-4xl">Profile</h1>
        <p className="mt-1 text-(-text-secondary)">Manage account details and change your master account password.</p>
      </div>

      {message ? <div className="alert-success rounded-lg p-4 text-sm font-semibold">{message}</div> : null}
      {error ? <div className="alert-danger rounded-lg p-4 text-sm font-semibold">{error}</div> : null}

      <form onSubmit={saveProfile} className="grid gap-4 app-card rounded-lg p-6 transition-colors duration-300">
        <h2 className="text-xl font-bold text-(-text-primary)">Update profile</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Name" value={profile.name} onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))} required />
          <Input label="Email" type="email" value={profile.email} onChange={(event) => setProfile((current) => ({ ...current, email: event.target.value }))} required />
        </div>
        <div className="flex justify-end">
          <Button type="submit">Save profile</Button>
        </div>
      </form>

      <form onSubmit={changePassword} className="grid gap-4 app-card rounded-lg p-6 transition-colors duration-300">
        <h2 className="text-xl font-bold text-(-text-primary)">Change password</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Current password" type="password" value={passwords.currentPassword} onChange={(event) => setPasswords((current) => ({ ...current, currentPassword: event.target.value }))} required />
          <Input label="New password" type="password" minLength={10} value={passwords.newPassword} onChange={(event) => setPasswords((current) => ({ ...current, newPassword: event.target.value }))} required />
        </div>
        <div className="flex justify-end">
          <Button type="submit">Change password</Button>
        </div>
      </form>
    </section>
  );
}
