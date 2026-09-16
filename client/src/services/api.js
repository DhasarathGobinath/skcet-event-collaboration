// api.js - Clean and simple API client for CampusCollab

const API_BASE = '/api';

export const getAuthToken = () => localStorage.getItem('campuscollab_token');

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('campuscollab_token', token);
  } else {
    localStorage.removeItem('campuscollab_token');
  }
};

export const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong. Please try again.');
  }

  return data;
};

export const api = {
  // Auth
  login: (credentials) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (userData) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  getMe: () => apiRequest('/auth/me'),

  updateProfile: (profileData) =>
    apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),

  // Events
  getEvents: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/events${query ? `?${query}` : ''}`);
  },

  getEvent: (id) => apiRequest(`/events/${id}`),

  createEvent: (eventData) =>
    apiRequest('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    }),

  updateEvent: (id, eventData) =>
    apiRequest(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    }),

  deleteEvent: (id) =>
    apiRequest(`/events/${id}`, {
      method: 'DELETE',
    }),

  addComment: (eventId, text) =>
    apiRequest(`/events/${eventId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    }),

  addRole: (eventId, roleData) =>
    apiRequest(`/events/${eventId}/roles`, {
      method: 'POST',
      body: JSON.stringify(roleData),
    }),

  // Applications / Collaborations
  applyForRole: (applicationData) =>
    apiRequest('/applications', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    }),

  getMyApplications: () => apiRequest('/applications/my'),

  getEventApplications: (eventId) =>
    apiRequest(`/applications/event/${eventId}`),

  updateApplicationStatus: (id, statusData) =>
    apiRequest(`/applications/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    }),

  // Users Directory
  getUsers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/users${query ? `?${query}` : ''}`);
  },

  getUserProfile: (id) => apiRequest(`/users/${id}`),
};
