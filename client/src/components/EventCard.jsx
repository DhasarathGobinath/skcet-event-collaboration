import React from 'react';
import { Calendar, MapPin, Users, Briefcase, ArrowRight } from 'lucide-react';

export const EventCard = ({ event, onSelect }) => {
  const openRolesCount = event.rolesNeeded?.filter((r) => !r.filled).length || 0;

  const getCategoryClass = (cat) => {
    switch (cat) {
      case 'Hackathon':
        return 'badge-tech';
      case 'Cultural Fest':
        return 'badge-cultural';
      case 'Workshop':
        return 'badge-workshop';
      case 'Sports':
        return 'badge-sports';
      default:
        return 'badge-tech';
    }
  };

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      className="glass-panel"
      style={{
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        height: '100%',
      }}
      onClick={() => onSelect(event._id)}
    >
      {/* Banner image or styled header */}
      <div style={{ position: 'relative', height: '170px', width: '100%', overflow: 'hidden' }}>
        <img
          src={
            event.bannerImage ||
            'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80'
          }
          alt={event.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(17,24,39,0.95) 0%, transparent 60%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            display: 'flex',
            gap: '6px',
          }}
        >
          <span className={`badge ${getCategoryClass(event.category)}`}>
            {event.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '0.25rem' }}>
          {event.clubName}
        </div>

        <h3
          style={{
            fontSize: '1.15rem',
            fontWeight: 700,
            marginBottom: '0.75rem',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {event.title}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar size={14} color="var(--primary)" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin size={14} color="var(--accent-rose)" />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.venue}</span>
          </div>
        </div>

        {/* Roles needed preview */}
        <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-cyan)' }}>
              <Briefcase size={14} />
              <span>{openRolesCount} Open Role{openRolesCount !== 1 ? 's' : ''}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <Users size={13} />
              <span>{event.collaborators?.length || 1} team</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {event.rolesNeeded?.slice(0, 2).map((role, idx) => (
              <span key={idx} className="skill-pill" style={{ fontSize: '0.7rem' }}>
                {role.title}
              </span>
            ))}
            {event.rolesNeeded?.length > 2 && (
              <span className="skill-pill" style={{ fontSize: '0.7rem', opacity: 0.7 }}>
                +{event.rolesNeeded.length - 2} more
              </span>
            )}
          </div>

          <button
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', justifyContent: 'space-between' }}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(event._id);
            }}
          >
            <span>View & Collaborate</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
