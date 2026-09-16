import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Search, Mail, Sparkles, User, Award, ExternalLink } from 'lucide-react';

export const DirectoryPage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await api.getUsers();
        setUsers(data);
      } catch (err) {
        console.error('Error fetching student directory:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchesDept = selectedDept === 'All' || u.department?.includes(selectedDept);
    const matchesSearch =
      !searchTerm ||
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.skills?.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesDept && matchesSearch;
  });

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.35rem' }}>
          Student & Talent Directory
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Find potential collaborators across engineering, design, arts, and business departments.
        </p>
      </div>

      {/* Search & Filter */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
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
            placeholder="Search by student name, department, or skill (e.g. React, Figma)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="form-select"
          style={{ maxWidth: '240px' }}
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
        >
          <option value="All">All Departments</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Information Technology">Information Technology</option>
          <option value="Design">Design & Visual Arts</option>
          <option value="Management">Management (BBA/MBA)</option>
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading directory...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
          No students found matching your criteria.
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {filteredUsers.map((u) => (
            <div
              key={u._id}
              className="glass-panel"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                <img
                  src={
                    u.avatar ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120'
                  }
                  alt={u.name}
                  style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{u.name}</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
                    {u.department}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {u.year}
                  </div>
                </div>
              </div>

              {u.bio && (
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {u.bio}
                </p>
              )}

              <div style={{ marginTop: 'auto' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 600 }}>
                  SKILLS & EXPERTISE:
                </div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  {u.skills?.map((sk, idx) => (
                    <span key={idx} className="skill-pill">
                      {sk}
                    </span>
                  ))}
                </div>

                <a
                  href={`mailto:${u.email}?subject=Collaboration%20Opportunity`}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                >
                  <Mail size={14} /> Contact to Collaborate
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
