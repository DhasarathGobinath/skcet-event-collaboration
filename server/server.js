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
