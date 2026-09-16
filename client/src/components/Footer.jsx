import React from 'react';
import { Sparkles, Heart, Award } from 'lucide-react';

export const Footer = () => {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-secondary)',
        padding: '2.5rem 1.5rem',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 800,
              fontSize: '0.85rem',
            }}
          >
            SKCET
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>
              SKCET EventCollab Platform
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Sri Krishna College of Engineering and Technology
            </div>
          </div>
        </div>

        {/* Founder Credit */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(99, 102, 241, 0.1)',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            border: '1px solid rgba(99, 102, 241, 0.25)',
          }}
        >
          <Award size={18} color="var(--primary)" />
          <div style={{ fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Platform Founder: </span>
            <strong style={{ color: '#fff' }}>Dhasarath Gobinath</strong>
          </div>
        </div>

        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          Built with <Heart size={13} color="var(--accent-rose)" style={{ display: 'inline', verticalAlign: 'middle' }} /> for SKCET SIH & Technical Symposia
        </div>
      </div>
    </footer>
  );
};
