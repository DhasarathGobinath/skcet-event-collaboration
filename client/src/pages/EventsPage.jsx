import React, { useState } from 'react';
import { EventCard } from '../components/EventCard';
import { Search, Filter, PlusCircle, CalendarX } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Hackathon',
  'Exhibition',
  'Technical Symposium',
  'Workshop',
  'Cultural Fest',
  'Sports',
];

export const EventsPage = ({ events, onSelectEvent, setCurrentTab }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const filteredEvents = events.filter((ev) => {
    const matchesCategory =
      selectedCategory === 'All' || ev.category === selectedCategory;

    const matchesStatus =
      selectedStatus === 'All' || ev.status === selectedStatus;

    const matchesSearch =
      !searchTerm ||
      ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.clubName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.venue.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesStatus && matchesSearch;
  });

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.35rem' }}>
            SKCET Events & SIH Collaborations
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Explore Smart India Hackathon internal selections, departmental expos, and collaborate with peers across SKCET.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setCurrentTab('create-event')}
        >
          <PlusCircle size={17} />
          <span>Host An Event</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem',
          marginBottom: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div
            style={{
              position: 'relative',
              flex: 1,
              minWidth: '240px',
            }}
          >
            <Search
              size={18}
              color="var(--text-muted)"
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.4rem' }}
              placeholder="Search by event title, club name, or venue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ minWidth: '180px' }}>
            <select
              className="form-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Seeking Collaborators">Seeking Collaborators</option>
              <option value="Team Full">Team Full</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '4px',
          }}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '999px',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  transition: 'var(--transition)',
                  backgroundColor: isSelected ? 'var(--primary)' : 'rgba(255, 255, 255, 0.06)',
                  color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                  border: isSelected ? '1px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Events Results Grid */}
      {filteredEvents.length === 0 ? (
        <div
          className="glass-panel"
          style={{
            textAlign: 'center',
            padding: '4rem 1.5rem',
          }}
        >
          <CalendarX
            size={48}
            color="var(--text-muted)"
            style={{ margin: '0 auto 1rem' }}
          />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            No matching events found
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Try adjusting your search keywords or category filters.
          </p>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setSelectedStatus('All');
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="events-grid">
          {filteredEvents.map((event) => (
            <EventCard key={event._id} event={event} onSelect={onSelectEvent} />
          ))}
        </div>
      )}
    </div>
  );
};
