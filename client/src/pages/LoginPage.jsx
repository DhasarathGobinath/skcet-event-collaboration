import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, BookOpen, AlertCircle, Award } from 'lucide-react';

const SKCET_DEPARTMENTS = [
  'Computer Science and Engineering (CSE)',
  'Information Technology (IT)',
  'Electronics and Communication Engineering (ECE)',
  'Electrical and Electronics Engineering (EEE)',
  'Mechanical Engineering',
  'Computer Science and Business Systems (CSBS)',
  'Artificial Intelligence and Data Science (AI&DS)',
  'Civil Engineering',
  'Mechatronics Engineering',
  'MBA',
];

export const LoginPage = ({ onLoginSuccess }) => {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: SKCET_DEPARTMENTS[0],
    year: '3rd Year',
    skills: '',
    bio: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegister) {
        await register(formData);
      } else {
        await login(formData.email, formData.password);
      }
      onLoginSuccess();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // Quick fill founder credentials
  const fillFounderCredentials = () => {
    setIsRegister(false);
    setFormData((prev) => ({
      ...prev,
      email: 'dhasarathgobinath2007@gmail.com',
      password: 'skcet2026',
    }));
  };

  return (
    <div style={{ maxWidth: '480px', margin: '2rem auto' }}>
      {/* Founder Login Shortcut */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem 1.5rem',
          marginBottom: '1.75rem',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          background: 'rgba(6, 182, 212, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Award size={20} color="var(--accent-cyan)" />
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fff' }}>
              Founder Account
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Dhasarath Gobinath
            </div>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={fillFounderCredentials}
          style={{ fontSize: '0.78rem' }}
        >
          Quick Fill Founder Credentials
        </button>
      </div>

      {/* Main Login / Register Box */}
      <div className="glass-panel" style={{ padding: '2rem 1.75rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          {isRegister ? 'SKCET Student Registration' : 'SKCET Student Portal'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          {isRegister
            ? 'Register with your college credentials to join SIH teams and project expos.'
            : 'Sign in to access your event collaboration dashboard.'}
        </p>

        {error && (
          <div
            style={{
              backgroundColor: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#fecdd3',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              marginBottom: '1.25rem',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Dhasarath Gobinath"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department *</label>
                <select
                  className="form-select"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  required
                >
                  {SKCET_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Year of Study *</label>
                <select
                  className="form-select"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="Final Year">Final Year</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Skills (comma-separated)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. MERN, Embedded C, Python, Figma, Circuit Design"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. rollno@skcet.ac.in or gmail"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.75rem', padding: '0.75rem' }}
            disabled={loading}
          >
            {loading ? 'Please wait...' : isRegister ? 'Register Account' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}
          >
            {isRegister
              ? 'Already have an account? Sign In'
              : "New to SKCET EventCollab? Register here"}
          </button>
        </div>
      </div>
    </div>
  );
};
