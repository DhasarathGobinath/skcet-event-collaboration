import React from 'react';
import { EventCard } from '../components/EventCard';
import { Sparkles, Calendar, Users, Rocket, ArrowRight, Award, Zap } from 'lucide-react';

export const HomePage = ({ events, onSelectEvent, setCurrentTab }) => {
  const totalRoles = events.reduce(
    (acc, ev) => acc + (ev.rolesNeeded?.filter((r) => !r.filled).length || 0),
    0
  );

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          textAlign: 'center',
          padding: '3rem 1rem 3.5rem',
          position: 'relative',
        }}
      >
        {/* Founder & Institution Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.45rem 1.15rem',
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '999px',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#a5b4fc',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <Award size={16} color="var(--accent-cyan)" />
          <span>Sri Krishna College of Engineering and Technology</span>
          <span style={{ opacity: 0.4 }}>&bull;</span>
          <span style={{ color: '#fff' }}>Founded by Dhasarath Gobinath</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.1rem, 4.5vw, 3.5rem)',
            fontWeight: 800,
            lineHeight: 1.18,
            letterSpacing: '-1px',
            maxWidth: '900px',
            margin: '0 auto 1.25rem',
          }}
        >
          SKCET Student Event &{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 50%, #38bdf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            SIH Collaboration Hub
          </span>
        </h1>

        <p
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.15rem)',
            color: 'var(--text-secondary)',
            maxWidth: '720px',
            margin: '0 auto 2rem',
            lineHeight: 1.6,
          }}
        >
          Built exclusively for SKCET students across CSE, IT, ECE, EEE, and Mechanical departments
          to assemble cross-functional teams for Smart India Hackathon (SIH 2026) and college project expos.
        </p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '3rem',
          }}
        >
          <button
            className="btn btn-primary"
            style={{ padding: '0.8rem 1.8rem', fontSize: '1rem' }}
            onClick={() => setCurrentTab('events')}
          >
            <span>Explore SKCET Events</span>
            <ArrowRight size={18} />
          </button>
          <button
            className="btn btn-secondary"
            style={{ padding: '0.8rem 1.8rem', fontSize: '1rem' }}
            onClick={() => setCurrentTab('create-event')}
          >
            <span>Host Department Event</span>
          </button>
        </div>

        {/* Live Metrics Banner */}
        <div
          className="glass-panel"
          style={{
            maxWidth: '840px',
            margin: '0 auto',
            padding: '1.25rem 2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.5rem',
          }}
        >
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>
              {events.length} Live
            </div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              SKCET Hackathons & Expos
            </div>
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
              {totalRoles} Open
            </div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              Collaboration Vacancies
            </div>
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
              100%
            </div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              Inter-Department Ready
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section style={{ marginBottom: '4.5rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.75rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Upcoming SKCET Events</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              SIH 2026 Internal Hackathons & Engineer's Day Project Expo
            </p>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setCurrentTab('events')}
          >
            <span>View All ({events.length})</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="events-grid">
          {events.map((event) => (
            <EventCard key={event._id} event={event} onSelect={onSelectEvent} />
          ))}
        </div>
      </section>

      {/* About Founder & Platform */}
      <section
        className="glass-panel"
        style={{
          padding: '2.5rem 2rem',
          marginBottom: '4rem',
          background: 'rgba(17, 24, 39, 0.6)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              <Award size={18} />
              ABOUT THE FOUNDER & VISION
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem' }}>
              Created by Dhasarath Gobinath
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1rem' }}>
              <strong>SKCET EventCollab</strong> was founded by <strong>Dhasarath Gobinath</strong> to solve a real campus challenge: enabling students at <em>Sri Krishna College of Engineering and Technology</em> to find cross-domain peers—pairing software developers with circuit specialists, UI designers, and pitch presenters for major hackathons like Smart India Hackathon (SIH) and departmental project expos.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="skill-pill">Sri Krishna College of Engg & Tech</span>
              <span className="skill-pill">SIH 2026 Preparation</span>
              <span className="skill-pill">Cross-Department Teams</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary)', marginBottom: '0.25rem' }}>
                1. Department SIH Rounds (15/09 - 16/09)
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Form balanced 6-member teams for SIH problem statement validation.
              </div>
            </div>

            <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--accent-cyan)', marginBottom: '0.25rem' }}>
                2. ECE Engineer’s Day Expo (15/09)
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Exhibit embedded systems, robotics, and VLSI prototypes.
              </div>
            </div>

            <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--accent-emerald)', marginBottom: '0.25rem' }}>
                3. College SIH Finals (18/09 - 19/09)
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Compete for official national nominee slots representing SKCET.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
