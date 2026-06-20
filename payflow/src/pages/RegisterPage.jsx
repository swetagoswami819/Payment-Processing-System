import { useState } from 'react';
import './Auth.css';
import { apiFetch } from '../api';

export default function RegisterPage({ switchToLogin }) {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'USER'
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
          role: form.role,   
        }),
      });

      setSuccess('Account created! You can now log in.');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">💸</div>
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-sub">Join PayFlow today</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              className="form-input"
              type="text"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          {/*ROLE SELECT */}
          <div className="form-group">
            <label className="form-label">Role</label>
            <select
              className="form-input"
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
            >
              <option value="USER">USER</option>
              <option value="MERCHANT">MERCHANT</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Register'}
          </button>
        </form>

        <div className="auth-links">
          Already have an account?{' '}
          <span className="auth-link" onClick={switchToLogin}>
            Login
          </span>
        </div>
      </div>
    </div>
  );
}