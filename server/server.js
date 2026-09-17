import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import applicationRoutes from './routes/applications.js';
import userRoutes from './routes/users.js';
import { autoSeedIfEmpty } from './scripts/seed.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/users', userRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    institution: 'Sri Krishna College of Engineering and Technology (SKCET)',
    founder: 'Dhasarath Gobinath',
    project: 'SKCET EventCollab Platform',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'connecting/disconnected',
  });
});

// Direct Backend Data Inspection (JSON)
app.get('/api/backend-data', async (req, res) => {
  try {
    const User = (await import('./models/User.js')).default;
    const Event = (await import('./models/Event.js')).default;
    const Application = (await import('./models/Application.js')).default;

    const users = await User.find({}).select('-password');
    const events = await Event.find({});
    const applications = await Application.find({}).populate('applicant', 'name email department');

    res.json({
      summary: {
        totalUsers: users.length,
        totalEvents: events.length,
        totalApplications: applications.length,
      },
      collections: {
        users,
        events,
        applications,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Visual HTML Table Dashboard for Database Inspection
app.get('/api/backend-data/view', async (req, res) => {
  try {
    const User = (await import('./models/User.js')).default;
    const Event = (await import('./models/Event.js')).default;
    const Application = (await import('./models/Application.js')).default;

    const users = await User.find({}).select('-password');
    const events = await Event.find({});
    const applications = await Application.find({}).populate('applicant', 'name email department');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>SKCET EventCollab - Backend Database Inspector</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0b0f19; color: #f3f4f6; margin: 0; padding: 2rem; }
          h1 { color: #6366f1; margin-bottom: 0.2rem; }
          .subtitle { color: #9ca3af; margin-bottom: 2rem; }
          .card { background: #111827; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem; box-shadow: 0 4px 20px rgba(0,0,0,0.4); }
          .card-title { font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem; color: #38bdf8; display: flex; justify-content: space-between; }
          .badge { background: #4f46e5; color: white; padding: 3px 10px; border-radius: 99px; font-size: 0.8rem; }
          table { width: 100%; border-collapse: collapse; margin-top: 0.5rem; }
          th, td { text-align: left; padding: 10px 14px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 0.875rem; }
          th { color: #9ca3af; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.5px; }
          tr:hover { background: rgba(255,255,255,0.02); }
          .pill { background: rgba(99,102,241,0.15); color: #a5b4fc; padding: 2px 8px; border-radius: 6px; font-size: 0.75rem; margin: 2px; display: inline-block; }
        </style>
      </head>
      <body>
        <h1>📊 SKCET EventCollab - Live Database Inspector</h1>
        <div class="subtitle">Sri Krishna College of Engineering and Technology &bull; Founder: Dhasarath Gobinath</div>

        <!-- USERS COLLECTION -->
        <div class="card">
          <div class="card-title">
            <span>👤 Users Collection (Registered Students & Admins)</span>
            <span class="badge">${users.length} Records</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Year</th>
                <th>Skills</th>
              </tr>
            </thead>
            <tbody>
              ${users.map(u => `
                <tr>
                  <td><strong>${u.name}</strong></td>
                  <td>${u.email}</td>
                  <td><span class="pill">${u.role}</span></td>
                  <td>${u.department}</td>
                  <td>${u.year}</td>
                  <td>${(u.skills || []).map(s => `<span class="pill">${s}</span>`).join(' ')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- EVENTS COLLECTION -->
        <div class="card">
          <div class="card-title">
            <span>📅 Events Collection (SKCET Hackathons & Expos)</span>
            <span class="badge">${events.length} Records</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>Event Title</th>
                <th>Category</th>
                <th>Organizing Body</th>
                <th>Date</th>
                <th>Venue</th>
                <th>Open Roles</th>
              </tr>
            </thead>
            <tbody>
              ${events.map(e => `
                <tr>
                  <td><strong>${e.title}</strong></td>
                  <td><span class="pill">${e.category}</span></td>
                  <td>${e.clubName}</td>
                  <td>${new Date(e.date).toLocaleDateString()}</td>
                  <td>${e.venue}</td>
                  <td>${(e.rolesNeeded || []).map(r => `<span class="pill">${r.title} (${r.spots} spots)</span>`).join('<br>')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- APPLICATIONS COLLECTION -->
        <div class="card">
          <div class="card-title">
            <span>🤝 Applications Collection (Collaboration Requests)</span>
            <span class="badge">${applications.length} Records</span>
          </div>
          ${applications.length === 0 ? '<p style="color: #9ca3af; font-size: 0.9rem;">No student applications in database yet.</p>' : `
            <table>
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Role Applied</th>
                  <th>Candidate Pitch</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${applications.map(a => `
                  <tr>
                    <td><strong>${a.applicant?.name || 'Student'}</strong><br><small style="color:#9ca3af">${a.applicant?.department || ''}</small></td>
                    <td><span class="pill">${a.roleTitle}</span></td>
                    <td>${a.pitch}</td>
                    <td><span class="pill">${a.status}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `}
        </div>
      </body>
      </html>
    `;
    res.send(html);
  } catch (error) {
    res.status(500).send('Error loading database view: ' + error.message);
  }
});

// Database Connection with graceful in-memory fallback
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/college_events';

  try {
    // Attempt connecting to the configured MongoDB URI (3-second timeout)
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`✅ MongoDB Connected to: ${mongoUri}`);
    await autoSeedIfEmpty();
  } catch (err) {
    console.log(`⚠️ Local/configured MongoDB not reachable (${err.message}).`);
    console.log('🔄 Starting built-in in-memory MongoDB fallback so the app works instantly...');

    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const inMemoryUri = mongod.getUri();
      await mongoose.connect(inMemoryUri);
      console.log(`✅ Connected to in-memory MongoDB at: ${inMemoryUri}`);
      await autoSeedIfEmpty();
    } catch (memErr) {
      console.error('❌ Failed to start in-memory MongoDB:', memErr.message);
    }
  }
};

connectDB();

// Global 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 CampusCollab Server running on port ${PORT}`);
});
