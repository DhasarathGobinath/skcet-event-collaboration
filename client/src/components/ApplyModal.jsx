import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { X, Send, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

export const ApplyModal = ({ event, role, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [pitch, setPitch] = useState('');
  const [skills, setSkills] = useState(user?.skills?.join(', ') || '');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pitch.trim()) {
      setError('Please write a brief pitch explaining how you want to contribute.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await api.applyForRole({
        eventId: event._id,
        roleTitle: role.title,
        pitch,
        skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
        portfolioLink,
      });

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="var(--primary)" />
              Apply for Role
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {role.title} &bull; {event.title}
            </p>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-secondary)', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center' }}>
            <CheckCircle2 size={48} color="var(--accent-emerald)" style={{ margin: '0 auto 1rem' }} />
            <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Application Submitted!</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              The event organizer will review your pitch and skills. You can track status under "My Collaborations".
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && (
                <div
                  style={{
                    backgroundColor: 'rgba(244, 63, 94, 0.15)',
                    border: '1px solid rgba(244, 63, 94, 0.3)',
                    color: '#fecdd3',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    marginBottom: '1rem',
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

              {/* Role description banner */}
              <div
                style={{
                  background: 'rgba(99, 102, 241, 0.08)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  borderRadius: '8px',
                  padding: '0.85rem',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.2rem' }}>
                  ROLE DETAILS
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                  {role.description || 'Collaborate with the core team to execute this event module.'}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Why do you want to collaborate & what will you contribute? *
                </label>
                <textarea
                  className="form-textarea"
                  placeholder="e.g. I have experience building full-stack web portals and designed the schedule dashboard for our previous symposium..."
                  value={pitch}
                  onChange={(e) => setPitch(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Relevant Skills (comma-separated)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. React, UI Design, Public Speaking"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Portfolio, GitHub or LinkedIn URL (optional)</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://github.com/yourhandle or https://behance.net/..."
                  value={portfolioLink}
                  onChange={(e) => setPortfolioLink(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                <Send size={15} />
                <span>{submitting ? 'Submitting...' : 'Send Application'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
