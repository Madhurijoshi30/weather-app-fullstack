import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, registerUser } from '../api/weatherApi';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [formData,   setFormData]   = useState({ name: '', email: '', password: '' });
  const [error,      setError]      = useState('');
  const [loading,    setLoading]    = useState(false);

  const { login }  = useAuth();
  const navigate   = useNavigate();

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // clear error as user types
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = isRegister
        ? await registerUser(formData)
        : await loginUser({ email: formData.email, password: formData.password });

      // Save token + user to context and localStorage
      login(res.data.user, res.data.token);

      // Send them home
      navigate('/');

    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Logo / title */}
        <div className="auth-logo">🌤</div>
        <h1 className="auth-title">Weather App</h1>
        <p className="auth-subtitle">
          {isRegister ? 'Create your account' : 'Welcome back'}
        </p>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>

          {/* Name field only shows on register */}
          {isRegister && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required={isRegister}
                autoComplete="name"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
            />
          </div>

          {/* Error message */}
          {error && <p className="auth-error">{error}</p>}

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading
              ? 'Please wait...'
              : isRegister ? 'Create Account' : 'Log In'}
          </button>
        </form>

        {/* Toggle between login and register */}
        <p className="auth-toggle">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <button
            className="auth-toggle-btn"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
              setFormData({ name: '', email: '', password: '' });
            }}
          >
            {isRegister ? 'Log In' : 'Sign Up'}
          </button>
        </p>

        {/* Back to home */}
        <Link to="/" className="back-home">← Back to home</Link>

      </div>
    </div>
  );
}