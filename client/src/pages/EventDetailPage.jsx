import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ApplyModal } from '../components/ApplyModal';
import {
  Calendar,
  MapPin,
  Users,
  Briefcase,
  ArrowLeft,
  MessageSquare,
  Send,
  ExternalLink,
  Mail,
  CheckCircle2,
  Trash2,
  Shield,
  Plus,
} from 'lucide-react';

export const EventDetailPage = ({ eventId, onBack, onEventUpdated }) => {
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [selectedRoleForApply, setSelectedRoleForApply] = useState(null);
  const [addingRole, setAddingRole] = useState(false);
  const [newRole, setNewRole] = useState({ title: '', skills: '', spots: 1, description: '' });

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const data = await api.getEvent(eventId);
      setEvent(data);
    } catch (err) {
      console.error('Error fetching event details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (!user) {
      alert('Please sign in or select a demo account from the top bar to post comments.');
      return;
    }

    setSubmittingComment(true);
    try {
      const updatedComments = await api.addComment(eventId, commentText.trim());
      setEvent((prev) => ({ ...prev, comments: updatedComments }));
      setCommentText('');
    } catch (err) {
      alert(err.message || 'Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleAddRole = async (e) => {
    e.preventDefault();
    if (!newRole.title.trim()) return;

    try {
      const updatedRoles = await api.addRole(eventId, {
        title: newRole.title,
        skills: newRole.skills.split(',').map((s) => s.trim()).filter(Boolean),
        spots: Number(newRole.spots),
        description: newRole.description,
      });
      setEvent((prev) => ({ ...prev, rolesNeeded: updatedRoles }));
      setNewRole({ title: '', skills: '', spots: 1, description: '' });
      setAddingRole(false);
    } catch (err) {
      alert(err.message || 'Failed to add role');
    }
  };

  const handleDeleteEvent = async () => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      try {
        await api.deleteEvent(eventId);
        if (onEventUpdated) onEventUpdated();
        onBack();
      } catch (err) {
        alert(err.message || 'Failed to delete event');
      }
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
        <div style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Loading event details...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
        <div style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Event not found</div>
        <button className="btn btn-secondary" onClick={onBack}>
          <ArrowLeft size={16} /> Back to Events
        </button>
      </div>
    );
  }

  const isOrganizer = user && event.organizer && (event.organizer._id === user._id || event.organizer === user._id);
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div>
      {/* Back button */}
      <button
        className="btn btn-secondary btn-sm"
        onClick={onBack}
        style={{ marginBottom: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
      >
        <ArrowLeft size={16} /> Back to Events
      </button>

      {/* Hero Banner with Details */}
      <div
        className="glass-panel"
        style={{
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          marginBottom: '2.5rem',
        }}
      >
        <div style={{ position: 'relative', height: '280px', width: '100%' }}>
          <img
            src={
              event.bannerImage ||
              'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80'
            }
            alt={event.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(11, 15, 25, 0.95) 0%, rgba(11, 15, 25, 0.4) 60%, transparent 100%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '1.5rem',
              left: '1.75rem',
              right: '1.75rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className="badge badge-tech">{event.category}</span>
                <span className="badge badge-status-open">{event.status}</span>
              </div>
              <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.3rem)', fontWeight: 800, lineHeight: 1.2 }}>
                {event.title}
              </h1>
              <div style={{ fontSize: '0.95rem', color: 'var(--accent-cyan)', fontWeight: 600, marginTop: '0.25rem' }}>
                Organized by {event.clubName}
              </div>
            </div>

            {isOrganizer && (
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={handleDeleteEvent}
                title="Delete this event"
              >
                <Trash2 size={15} /> Delete Event
              </button>
            )}
          </div>
        </div>

        {/* Quick Details Bar */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderTop: '1px solid var(--border-color)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
            backgroundColor: 'rgba(17, 24, 39, 0.4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)' }}>
              <Calendar size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Date & Time</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{formattedDate}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(244, 63, 94, 0.15)', color: 'var(--accent-rose)' }}>
              <MapPin size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Campus Venue</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{event.venue}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}>
              <Users size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Current Team</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                {event.collaborators?.length || 1} Member{event.collaborators?.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {event.contactEmail && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)' }}>
                <Mail size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Contact Organizer</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{event.contactEmail}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Description & Roles */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          marginBottom: '2.5rem',
        }}
      >
        {/* Left Column: Event Overview & Team */}
        <div>
          <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
              About the Event
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem', whiteSpace: 'pre-line' }}>
              {event.description}
            </p>

            {event.registrationUrl && (
              <div style={{ marginTop: '1.5rem' }}>
                <a
                  href={event.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <span>Official Registration / Portal</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            )}
          </div>

          {/* Current Collaborators & Team */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} color="var(--primary)" />
              Event Organizing Team
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {/* Organizer Card */}
              {event.organizer && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <img
                    src={
                      event.organizer.avatar ||
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
                    }
                    alt={event.organizer.name}
                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.925rem' }}>
                      {event.organizer.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {event.organizer.department || 'Event Creator'} &bull; Organizer
                    </div>
                  </div>
                  <span className="badge badge-tech">Lead</span>
                </div>
              )}

              {/* Collaborator Team Members */}
              {event.collaborators
                ?.filter((c) => c.user && c.user._id !== event.organizer?._id)
                .map((collab, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <img
                      src={
                        collab.user.avatar ||
                        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
                      }
                      alt={collab.user.name}
                      style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                        {collab.user.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {collab.user.department || 'Student Collaborator'}
                      </div>
                    </div>
                    <span className="badge badge-workshop">{collab.roleTitle}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right Column: Roles Needed & Apply */}
        <div>
          <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Briefcase size={18} color="var(--accent-cyan)" />
                Collaboration Vacancies
              </h2>

              {isOrganizer && !addingRole && (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setAddingRole(true)}
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                >
                  <Plus size={14} /> Add Role
                </button>
              )}
            </div>

            {/* Organizer Quick Add Role Form */}
            {isOrganizer && addingRole && (
              <form
                onSubmit={handleAddRole}
                style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                  Post a New Vacancy
                </div>
                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Role Title (e.g. Stage Sound Lead)"
                    value={newRole.title}
                    onChange={(e) => setNewRole({ ...newRole, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Skills needed (comma-separated)"
                    value={newRole.skills}
                    onChange={(e) => setNewRole({ ...newRole, skills: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Brief description of duties"
                    value={newRole.description}
                    onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setAddingRole(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    Save Role
                  </button>
                </div>
              </form>
            )}

            {/* List of Roles */}
            {event.rolesNeeded?.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-secondary)' }}>
                No active collaboration vacancies posted for this event currently.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {event.rolesNeeded?.map((role, idx) => {
                  const isUserOrganizer = user && event.organizer && (user._id === event.organizer._id || user._id === event.organizer);
                  return (
                    <div
                      key={idx}
                      style={{
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.07)',
                        transition: 'var(--transition)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{role.title}</h4>
                          <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>
                            {role.spots || 1} Open Spot{(role.spots || 1) !== 1 ? 's' : ''}
                          </span>
                        </div>
                        {role.filled ? (
                          <span className="badge badge-status-open">Filled</span>
                        ) : (
                          <span className="badge badge-status-pending">Seeking</span>
                        )}
                      </div>

                      {role.description && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                          {role.description}
                        </p>
                      )}

                      {/* Required Skills */}
                      {role.skills?.length > 0 && (
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '1rem' }}>
                          {role.skills.map((sk, sIdx) => (
                            <span key={sIdx} className="skill-pill">
                              {sk}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Apply button */}
                      {!role.filled && !isUserOrganizer && (
                        <button
                          className="btn btn-primary btn-sm"
                          style={{ width: '100%' }}
                          onClick={() => setSelectedRoleForApply(role)}
                        >
                          Apply to Collaborate
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Discussion & Team Updates Board */}
      <section className="glass-panel" style={{ padding: '2rem 1.75rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MessageSquare size={20} color="var(--primary)" />
          Collaboration Discussion & Announcements
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Ask questions, coordinate requirements, or post announcements for this event.
        </p>

        {/* Comment input */}
        <form onSubmit={handleAddComment} style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <textarea
              className="form-textarea"
              placeholder={user ? `Add to the discussion as ${user.name}...` : 'Sign in or select a demo account to post...'}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={2}
              style={{ flex: 1, minHeight: '60px' }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{ height: '50px', padding: '0 1.25rem' }}
              disabled={submittingComment || !commentText.trim()}
            >
              <Send size={16} />
              <span>Post</span>
            </button>
          </div>
        </form>

        {/* Comments stream */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {event.comments?.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No messages yet. Be the first to start the collaboration discussion!
            </div>
          ) : (
            event.comments?.map((comment, index) => (
              <div
                key={index}
                style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{comment.userName}</span>
                    {comment.userDepartment && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        &bull; {comment.userDepartment}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  {comment.text}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Apply Modal */}
      {selectedRoleForApply && (
        <ApplyModal
          event={event}
          role={selectedRoleForApply}
          onClose={() => setSelectedRoleForApply(null)}
          onSuccess={() => {
            fetchEvent();
          }}
        />
      )}
    </div>
  );
};
