import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Plus, Trash2, Calendar, MapPin, Sparkles, Image as ImageIcon, ArrowLeft } from 'lucide-react';

const PRESET_BANNERS = [
  { label: 'Hackathon & Tech', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80' },
  { label: 'Cultural & Music', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80' },
  { label: 'Robotics & Hardware', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80' },
  { label: 'Workshop & Seminar', url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80' },
];

export const CreateEventPage = ({ onEventCreated, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Technical Symposium',
    clubName: 'College Event Council',
    date: '',
    venue: '',
    description: '',
    bannerImage: PRESET_BANNERS[0].url,
    registrationUrl: '',
    contactEmail: user?.email || '',
  });

  const [roles, setRoles] = useState([
    { title: 'Frontend Developer', skills: 'React, CSS', spots: 1, description: 'Build registration site' },
    { title: 'Graphic Designer', skills: 'Figma, Canva', spots: 1, description: 'Design event posters and social posts' },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleChange = (index, field, value) => {
    const updated = [...roles];
    updated[index][field] = value;
    setRoles(updated);
  };

  const addRoleSlot = () => {
    setRoles([...roles, { title: '', skills: '', spots: 1, description: '' }]);
  };

  const removeRoleSlot = (index) => {
    setRoles(roles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in or select a demo account from the top bar first.');
      return;
    }

    if (!formData.title || !formData.date || !formData.venue || !formData.description) {
      setError('Please fill in all mandatory event information.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formattedRoles = roles
        .filter((r) => r.title.trim())
        .map((r) => ({
          title: r.title.trim(),
          skills: r.skills ? r.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
          spots: Number(r.spots) || 1,
          description: r.description.trim(),
        }));

      const newEvent = await api.createEvent({
        ...formData,
        rolesNeeded: formattedRoles,
      });

      onEventCreated(newEvent._id);
    } catch (err) {
      setError(err.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto' }}>
      <button
        className="btn btn-secondary btn-sm"
        onClick={onCancel}
        style={{ marginBottom: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
      >
        <ArrowLeft size={16} /> Cancel
      </button>

      <div className="glass-panel" style={{ padding: '2.5rem 2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Sparkles size={24} color="var(--primary)" />
            Host a Campus Event
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Post your upcoming college event and recruit students across departments for core committee roles.
          </p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#fecdd3',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Event Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. InnovateX 2026: National Tech Symposium"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Technical Symposium">Technical Symposium</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Cultural Fest">Cultural Fest</option>
                <option value="Workshop">Workshop</option>
                <option value="Sports">Sports</option>
                <option value="Guest Lecture">Guest Lecture</option>
                <option value="Exhibition">Exhibition</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Organizing Club or Department *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Robotics Club, Literary Society, CSE Dept"
                value={formData.clubName}
                onChange={(e) => setFormData({ ...formData, clubName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Event Date *</label>
              <input
                type="date"
                className="form-input"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Campus Venue / Location *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Main Auditorium, Seminar Hall 2"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Event Description & Agenda *</label>
            <textarea
              className="form-textarea"
              rows={4}
              placeholder="Describe the event, target audience, prize pool, expected attendance, and timeline..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          {/* Banner Preset Selection */}
          <div className="form-group">
            <label className="form-label">Banner Image Preset</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
              {PRESET_BANNERS.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => setFormData({ ...formData, bannerImage: preset.url })}
                  style={{
                    position: 'relative',
                    height: '75px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: formData.bannerImage === preset.url ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <img src={preset.url} alt={preset.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#fff' }}>{preset.label}</span>
                  </div>
                </div>
              ))}
            </div>
            <input
              type="url"
              className="form-input"
              placeholder="Or paste a custom image URL..."
              value={formData.bannerImage}
              onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
            />
          </div>

          {/* Roles to Recruit */}
          <div style={{ marginTop: '2.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Collaboration Vacancies to Recruit</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Specify the skillsets and positions you need other students to fill.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={addRoleSlot}
              >
                <Plus size={15} /> Add Another Role
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {roles.map((role, index) => (
                <div
                  key={index}
                  style={{
                    padding: '1.25rem',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Role Title (e.g. Lead Web Developer)"
                      value={role.title}
                      onChange={(e) => handleRoleChange(index, 'title', e.target.value)}
                      style={{ flex: 2 }}
                      required
                    />
                    <input
                      type="number"
                      className="form-input"
                      placeholder="Spots"
                      value={role.spots}
                      min="1"
                      max="10"
                      onChange={(e) => handleRoleChange(index, 'spots', e.target.value)}
                      style={{ width: '85px' }}
                    />
                    {roles.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRoleSlot(index)}
                        style={{ color: 'var(--accent-rose)', padding: '6px' }}
                        title="Remove role slot"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Skills needed (e.g. React, UI/UX, Canva)"
                      value={role.skills}
                      onChange={(e) => handleRoleChange(index, 'skills', e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Brief role expectation"
                      value={role.description}
                      onChange={(e) => handleRoleChange(index, 'description', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Links & Contact */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2.5rem' }}>
            <div className="form-group">
              <label className="form-label">Registration / External Form URL (Optional)</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://forms.gle/..."
                value={formData.registrationUrl}
                onChange={(e) => setFormData({ ...formData, registrationUrl: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="organizer@college.edu"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }} disabled={loading}>
              <Sparkles size={16} />
              <span>{loading ? 'Publishing Event...' : 'Publish Event & Open Vacancies'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
