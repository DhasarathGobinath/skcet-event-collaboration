import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Users, Sparkles, PlusCircle, LogOut, Compass, User } from 'lucide-react';

export const Navbar = ({ currentTab, setCurrentTab }) => {
  const { user, logout } = useAuth();

  return (
    <header
      style={{
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'rgba(11, 15, 25, 0.88)',
        backdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '0.85rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        {/* SKCET College Logo & Founder Info */}
        <div
          onClick={() => setCurrentTab('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
              fontWeight: 800,
              fontSize: '1rem',
              color: '#fff',
              letterSpacing: '0.5px',
            }}
          >
            SKCET
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
                SKCET <span style={{ color: 'var(--primary)' }}>EventCollab</span>
              </span>
              <span
                style={{
                  fontSize: '0.68rem',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  background: 'rgba(6, 182, 212, 0.15)',
                  color: 'var(--accent-cyan)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  fontWeight: 600,
                }}
              >
                Founder: Dhasarath Gobinath
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '-1px' }}>
              Sri Krishna College of Engineering and Technology
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setCurrentTab('home')}
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: currentTab === 'home' ? 'var(--primary)' : 'var(--text-secondary)',
              backgroundColor: currentTab === 'home' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Compass size={16} /> Home
          </button>

          <button
            onClick={() => setCurrentTab('events')}
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: currentTab === 'events' ? 'var(--primary)' : 'var(--text-secondary)',
              backgroundColor: currentTab === 'events' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Calendar size={16} /> SKCET Events
          </button>

          <button
            onClick={() => setCurrentTab('collaborations')}
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: currentTab === 'collaborations' ? 'var(--primary)' : 'var(--text-secondary)',
              backgroundColor: currentTab === 'collaborations' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Users size={16} /> Collaborations
          </button>

          <button
            onClick={() => setCurrentTab('directory')}
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: currentTab === 'directory' ? 'var(--primary)' : 'var(--text-secondary)',
              backgroundColor: currentTab === 'directory' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            Students
          </button>
        </nav>

        {/* Action Buttons & User Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setCurrentTab('create-event')}
          >
            <PlusCircle size={16} /> Host Event
          </button>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.05)',
                  fontSize: '0.85rem',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <User size={14} color="var(--accent-cyan)" />
                <span style={{ fontWeight: 600 }}>{user.name.split(' ')[0]}</span>
                {user.email === 'dhasarathgobinath2007@gmail.com' && (
                  <span style={{ fontSize: '0.65rem', background: 'var(--primary)', color: '#fff', padding: '1px 5px', borderRadius: '4px' }}>
                    Founder
                  </span>
                )}
              </div>
              <button
                onClick={logout}
                className="btn btn-secondary btn-sm"
                title="Sign Out"
                style={{ color: 'var(--accent-rose)', padding: '0.4rem 0.6rem' }}
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setCurrentTab('login')}
              className="btn btn-secondary btn-sm"
            >
              Sign In / Register
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
