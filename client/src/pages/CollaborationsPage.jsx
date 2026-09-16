import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Briefcase,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Calendar,
  Users,
  AlertCircle,
  Filter,
} from 'lucide-react';

export const CollaborationsPage = ({ onSelectEvent, setCurrentTab }) => {
  const { user } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState('sent'); // 'sent' or 'received'
  const [myApplications, setMyApplications] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [eventApplications, setEventApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // Fetch student's sent applications
  const fetchMyApplications = async () => {
    try {
      setLoading(true);
      const data = await api.getMyApplications();
      setMyApplications(data);
    } catch (err) {
      console.error('Error fetching sent applications:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch organizer's events & applications received
  const fetchMyEvents = async () => {
    try {
      const allEvents = await api.getEvents();
      const organizedByMe = allEvents.filter(
        (ev) => ev.organizer && ev.organizer._id === user?._id
      );
      setMyEvents(organizedByMe);

      if (organizedByMe.length > 0 && !selectedEventId) {
        setSelectedEventId(organizedByMe[0]._id);
        fetchEventApplicants(organizedByMe[0]._id);
      }
    } catch (err) {
      console.error('Error fetching organized events:', err);
    }
  };

  const fetchEventApplicants = async (eventId) => {
    try {
      setLoading(true);
      const data = await api.getEventApplications(eventId);
      setEventApplications(data);
    } catch (err) {
      console.error('Error fetching event applicants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyApplications();
      fetchMyEvents();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleEventChange = (e) => {
    const eId = e.target.value;
    setSelectedEventId(eId);
    if (eId) {
      fetchEventApplicants(eId);
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    setActionLoading(appId);
    try {
      await api.updateApplicationStatus(appId, { status: newStatus });
      // Refresh event applications
      if (selectedEventId) {
        await fetchEventApplicants(selectedEventId);
      }
    } catch (err) {
      alert(err.message || 'Failed to update application status');
    } finally {
      setActionLoading(null);
    }
  };

  if (!user) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 1.5rem', maxWidth: '600px', margin: '3rem auto' }}>
        <Users size={48} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Access Your Collaboration Hub
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
          Please sign in or select one of the demo student accounts in the navigation bar above to view your applications and manage team recruitment.
        </p>
        <button className="btn btn-primary" onClick={() => setCurrentTab('login')}>
          Sign In / Demo Login
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.35rem' }}>
          Collaboration Hub
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Track your role applications and review applicants for events you are organizing.
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          borderBottom: '1px solid var(--border-color)',
          marginBottom: '2rem',
        }}
      >
        <button
          onClick={() => setActiveSubTab('sent')}
          style={{
            padding: '0.75rem 1.25rem',
            fontWeight: 600,
            fontSize: '0.95rem',
            color: activeSubTab === 'sent' ? 'var(--primary)' : 'var(--text-secondary)',
            borderBottom: activeSubTab === 'sent' ? '2px solid var(--primary)' : '2px solid transparent',
            marginBottom: '-1px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Briefcase size={16} />
          <span>My Applications ({myApplications.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveSubTab('received');
            if (selectedEventId) fetchEventApplicants(selectedEventId);
          }}
          style={{
            padding: '0.75rem 1.25rem',
            fontWeight: 600,
            fontSize: '0.95rem',
            color: activeSubTab === 'received' ? 'var(--primary)' : 'var(--text-secondary)',
            borderBottom: activeSubTab === 'received' ? '2px solid var(--primary)' : '2px solid transparent',
            marginBottom: '-1px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Users size={16} />
          <span>Review Incoming Applicants ({myEvents.length} Hosted Events)</span>
        </button>
      </div>

      {/* TAB 1: SENT APPLICATIONS */}
      {activeSubTab === 'sent' && (
        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>Loading applications...</div>
          ) : myApplications.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
              <Clock size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                You haven't applied for any roles yet
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Browse active college events looking for developers, designers, and organizers.
              </p>
              <button className="btn btn-primary btn-sm" onClick={() => setCurrentTab('events')}>
                Browse Open Events
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {myApplications.map((app) => {
                const isAccepted = app.status === 'Accepted';
                const isRejected = app.status === 'Rejected';
                return (
                  <div
                    key={app._id}
                    className="glass-panel"
                    style={{
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                          {app.event?.clubName || 'Campus Event'}
                        </div>
                        <h3
                          style={{ fontSize: '1.2rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                          onClick={() => app.event && onSelectEvent(app.event._id)}
                        >
                          {app.event?.title}
                          <ExternalLink size={15} color="var(--text-muted)" />
                        </h3>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                          Role: <span style={{ color: 'var(--primary)' }}>{app.roleTitle}</span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div>
                        {isAccepted && <span className="badge badge-status-open"><CheckCircle2 size={13} /> Accepted</span>}
                        {isRejected && <span className="badge badge-status-rejected"><XCircle size={13} /> Declined</span>}
                        {!isAccepted && !isRejected && <span className="badge badge-status-pending"><Clock size={13} /> Under Review</span>}
                      </div>
                    </div>

                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        padding: '1rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                      }}
                    >
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 600 }}>
                        YOUR PITCH & PROPOSAL:
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {app.pitch}
                      </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {app.skills?.map((sk, idx) => (
                          <span key={idx} className="skill-pill">
                            {sk}
                          </span>
                        ))}
                      </div>

                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Submitted on {new Date(app.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: REVIEW RECEIVED APPLICANTS */}
      {activeSubTab === 'received' && (
        <div>
          {myEvents.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
              <AlertCircle size={40} color="var(--accent-amber)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                You haven't hosted any events yet
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Create an event to start recruiting student developers, designers, and managers!
              </p>
              <button className="btn btn-primary btn-sm" onClick={() => setCurrentTab('create-event')}>
                Host an Event
              </button>
            </div>
          ) : (
            <div>
              {/* Event Selector */}
              <div
                className="glass-panel"
                style={{
                  padding: '1rem 1.25rem',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  flexWrap: 'wrap',
                }}
              >
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Select Hosted Event:
                </span>
                <select
                  className="form-select"
                  value={selectedEventId}
                  onChange={handleEventChange}
                  style={{ maxWidth: '400px' }}
                >
                  {myEvents.map((ev) => (
                    <option key={ev._id} value={ev._id}>
                      {ev.title} ({ev.rolesNeeded?.length || 0} roles)
                    </option>
                  ))}
                </select>
              </div>

              {/* Applicants List */}
              {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>Loading applicants...</div>
              ) : eventApplications.length === 0 ? (
                <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                  <Users size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    No applications received yet for this event
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    Students browsing your event will appear here once they submit a collaboration request.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {eventApplications.map((app) => {
                    const applicant = app.applicant || {};
                    return (
                      <div
                        key={app._id}
                        className="glass-panel"
                        style={{
                          padding: '1.5rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '1rem',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                          <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                            <img
                              src={
                                applicant.avatar ||
                                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
                              }
                              alt={applicant.name}
                              style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <div>
                              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                                {applicant.name || 'Student Applicant'}
                              </h3>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                {applicant.department} &bull; {applicant.year} &bull; {applicant.email}
                              </div>
                            </div>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <span className="badge badge-workshop">Applied for: {app.roleTitle}</span>
                            <div style={{ marginTop: '0.35rem' }}>
                              {app.status === 'Accepted' && <span className="badge badge-status-open">Accepted</span>}
                              {app.status === 'Rejected' && <span className="badge badge-status-rejected">Declined</span>}
                              {app.status === 'Pending' && <span className="badge badge-status-pending">Pending Review</span>}
                            </div>
                          </div>
                        </div>

                        {/* Pitch details */}
                        <div
                          style={{
                            background: 'rgba(255, 255, 255, 0.02)',
                            padding: '1rem',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                          }}
                        >
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 600 }}>
                            CANDIDATE PITCH:
                          </div>
                          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            {app.pitch}
                          </p>
                        </div>

                        {/* Skills & Portfolio */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                            {applicant.skills?.map((sk, idx) => (
                              <span key={idx} className="skill-pill">
                                {sk}
                              </span>
                            ))}
                          </div>

                          {app.portfolioLink && (
                            <a
                              href={app.portfolioLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-secondary btn-sm"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem' }}
                            >
                              <span>View Portfolio / GitHub</span>
                              <ExternalLink size={13} />
                            </a>
                          )}
                        </div>

                        {/* Action Buttons for Organizer */}
                        {app.status === 'Pending' && (
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'flex-end',
                              gap: '0.75rem',
                              paddingTop: '0.75rem',
                              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                            }}
                          >
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleUpdateStatus(app._id, 'Rejected')}
                              disabled={actionLoading === app._id}
                            >
                              <XCircle size={15} /> Decline
                            </button>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleUpdateStatus(app._id, 'Accepted')}
                              disabled={actionLoading === app._id}
                              style={{ background: 'var(--accent-emerald)', borderColor: 'var(--accent-emerald)' }}
                            >
                              <CheckCircle2 size={15} /> Accept & Add to Team
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
