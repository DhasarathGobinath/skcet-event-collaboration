import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { CreateEventPage } from './pages/CreateEventPage';
import { CollaborationsPage } from './pages/CollaborationsPage';
import { DirectoryPage } from './pages/DirectoryPage';
import { LoginPage } from './pages/LoginPage';

function MainApp() {
  const [currentTab, setCurrentTab] = useState('home');
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await api.getEvents();
      setEvents(data);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSelectEvent = (id) => {
    setSelectedEventId(id);
    setCurrentTab('event-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEventCreated = (newId) => {
    fetchEvents();
    setSelectedEventId(newId);
    setCurrentTab('event-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <main className="main-content">
        {currentTab === 'home' && (
          <HomePage
            events={events}
            onSelectEvent={handleSelectEvent}
            setCurrentTab={setCurrentTab}
          />
        )}

        {currentTab === 'events' && (
          <EventsPage
            events={events}
            onSelectEvent={handleSelectEvent}
            setCurrentTab={setCurrentTab}
          />
        )}

        {currentTab === 'event-detail' && selectedEventId && (
          <EventDetailPage
            eventId={selectedEventId}
            onBack={() => setCurrentTab('events')}
            onEventUpdated={fetchEvents}
          />
        )}

        {currentTab === 'create-event' && (
          <CreateEventPage
            onEventCreated={handleEventCreated}
            onCancel={() => setCurrentTab('events')}
          />
        )}

        {currentTab === 'collaborations' && (
          <CollaborationsPage
            onSelectEvent={handleSelectEvent}
            setCurrentTab={setCurrentTab}
          />
        )}

        {currentTab === 'directory' && <DirectoryPage />}

        {currentTab === 'login' && (
          <LoginPage onLoginSuccess={() => setCurrentTab('home')} />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
