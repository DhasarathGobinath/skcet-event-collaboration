import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Event from '../models/Event.js';
import Application from '../models/Application.js';

dotenv.config();

export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting SKCET database seeding...');

    // Clear old data
    await User.deleteMany({});
    await Event.deleteMany({});
    await Application.deleteMany({});

    const hashedPassword = await bcrypt.hash('skcet2026', 10);

    // Create Founder Account: Dhasarath Gobinath
    const founder = await User.create({
      name: 'Dhasarath Gobinath',
      email: 'dhasarathgobinath2007@gmail.com',
      password: hashedPassword,
      role: 'admin',
      department: 'Computer Science and Engineering',
      year: 'Final Year',
      skills: ['Full Stack MERN', 'Platform Architecture', 'Event Leadership', 'React', 'Node.js'],
      bio: 'Founder of SKCET EventCollab. Student at Sri Krishna College of Engineering and Technology. Building collaboration tools for hackathons and inter-departmental symposia.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      phone: '+91 98765 00001',
    });

    // Create the 3 specific SKCET Events requested by the user
    const events = await Event.insertMany([
      {
        title: 'Department Level SIH 2026 Selection',
        description:
          'Smart India Hackathon (SIH 2026) Department-Level Internal Screening and Idea Pitching Round at Sri Krishna College of Engineering and Technology (SKCET). Teams from CSE, IT, ECE, EEE, and Mechanical present software and hardware problem statement solutions before the department evaluation committee.\n\nOpen vacancies for inter-disciplinary collaboration: cross-domain teams are highly encouraged for AI/IoT problem statements.',
        category: 'Hackathon',
        clubName: 'SKCET SIH Committee & Innovation Cell',
        date: new Date('2026-09-15T09:00:00.000Z'),
        venue: 'SKCET Department Seminar Halls & Computing Labs',
        bannerImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
        organizer: founder._id,
        status: 'Seeking Collaborators',
        contactEmail: 'dhasarathgobinath2007@gmail.com',
        registrationUrl: '',
        rolesNeeded: [
          {
            title: 'Full Stack / AI Prototype Lead',
            skills: ['MERN', 'Python', 'FastAPI', 'Machine Learning'],
            spots: 3,
            description: 'Collaborate with team to implement core prototype and live model demonstration for SIH problem statement.',
            filled: false,
          },
          {
            title: 'UI/UX & Pitch Deck Designer',
            skills: ['Figma', 'Pitch Decks', 'Canva', 'System Architecture Diagrams'],
            spots: 2,
            description: 'Design interactive wireframes and structure presentation slides for the department jury evaluation.',
            filled: false,
          },
          {
            title: 'Hardware & IoT Specialist',
            skills: ['Arduino', 'Raspberry Pi', 'Sensors', 'Embedded C'],
            spots: 2,
            description: 'Lead hardware prototype assembly, circuit testing, and sensor integrations for smart hardware problem categories.',
            filled: false,
          },
        ],
        collaborators: [
          {
            user: founder._id,
            roleTitle: 'Event Founder & Student Convener',
          },
        ],
        comments: [
          {
            user: founder._id,
            userName: founder.name,
            userDepartment: founder.department,
            text: 'Welcome SKCETians! All department teams gearing up for SIH 2026 internal selection (15/09/2026 - 16/09/2026) can connect and recruit teammates across departments here.',
            createdAt: new Date('2026-09-10T10:00:00.000Z'),
          },
        ],
      },
      {
        title: 'Project Expo by ECE Department (Engineer’s Day Special)',
        description:
          'Celebration of National Engineer’s Day at Sri Krishna College of Engineering and Technology organized by the Department of Electronics and Communication Engineering (ECE).\n\nShowcasing groundbreaking student projects in Embedded Systems, VLSI Design, Robotics, Wireless Sensor Networks, and Biomedical Electronics. Highlighting innovation, peer collaboration, and engineering excellence.',
        category: 'Exhibition',
        clubName: 'Department of ECE, SKCET',
        date: new Date('2026-09-15T09:30:00.000Z'),
        venue: 'ECE Block Labs & Main Central Courtyard, SKCET',
        bannerImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
        organizer: founder._id,
        status: 'Seeking Collaborators',
        contactEmail: 'ece-events@skcet.ac.in',
        registrationUrl: '',
        rolesNeeded: [
          {
            title: 'Circuit & Embedded Testing Coordinator',
            skills: ['Oscilloscope', 'Multimeter', 'PCB Debugging', 'Power Supplies'],
            spots: 2,
            description: 'Assist student project stalls with lab equipment, circuit troubleshooting, and test bench support.',
            filled: false,
          },
          {
            title: 'Project Expo Event Manager',
            skills: ['Stall Arrangement', 'Guest Hospitality', 'Schedule Management'],
            spots: 3,
            description: 'Coordinate project stall allocations, judge visits, and attendee guidance across the expo hall.',
            filled: false,
          },
          {
            title: 'Technical Documentation & Media Lead',
            skills: ['Photography', 'Technical Writing', 'Project Abstract Compilation'],
            spots: 2,
            description: 'Compile project abstracts for the official Engineer’s Day souvenir magazine and cover photo/video moments.',
            filled: false,
          },
        ],
        collaborators: [
          {
            user: founder._id,
            roleTitle: 'Platform Host & Coordinator',
          },
        ],
        comments: [
          {
            user: founder._id,
            userName: founder.name,
            userDepartment: founder.department,
            text: 'ECE Department Engineer’s Day Project Expo is scheduled for 15/09/2026! Let us make this expo a memorable showcase of engineering talent.',
            createdAt: new Date('2026-09-11T12:00:00.000Z'),
          },
        ],
      },
      {
        title: 'College Level SIH 2026 Selection',
        description:
          'The Grand Institutional Finals for Smart India Hackathon 2026 at Sri Krishna College of Engineering and Technology (SKCET).\n\nThe top shortlisted teams from all departments compete in a 24-hour hackathon sprint before industry judges, alumni mentors, and college leadership to determine the official nominees representing SKCET at the national Smart India Hackathon grand finale.',
        category: 'Hackathon',
        clubName: 'SKCET Central Hackathon Council',
        date: new Date('2026-09-18T08:30:00.000Z'),
        venue: 'SKCET Vankatram Hall & Central Computing Center',
        bannerImage: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80',
        organizer: founder._id,
        status: 'Seeking Collaborators',
        contactEmail: 'dhasarathgobinath2007@gmail.com',
        registrationUrl: '',
        rolesNeeded: [
          {
            title: 'Sprint Mentor & Technical Evaluator',
            skills: ['System Architecture', 'Code Review', 'Cloud Deployment'],
            spots: 4,
            description: 'Review shortlisted codebase architecture, dockerization, and suggest cloud optimizations before the final jury rounds.',
            filled: false,
          },
          {
            title: 'Stage & Presentation Pitch Coach',
            skills: ['Public Speaking', 'Pitch Delivery', 'Q&A Prep'],
            spots: 2,
            description: 'Guide student finalists to refine their 5-minute pitch timing and handle jury technical cross-questions.',
            filled: false,
          },
          {
            title: 'Central Hackathon Logistics Volunteer',
            skills: ['Network Management', 'Coordination', 'Lab Administration'],
            spots: 5,
            description: 'Manage 24h high-speed LAN connectivity, overnight lab amenities, and badge verifications.',
            filled: false,
          },
        ],
        collaborators: [
          {
            user: founder._id,
            roleTitle: 'Chief Student Organizer',
          },
        ],
        comments: [
          {
            user: founder._id,
            userName: founder.name,
            userDepartment: founder.department,
            text: 'Shortlisted teams from the 15/09 - 16/09 department rounds will advance to this college-level final on 18/09/2026 - 19/09/2026. Prepare your presentations and working prototypes!',
            createdAt: new Date('2026-09-12T14:30:00.000Z'),
          },
        ],
      },
    ]);

    console.log('✅ SKCET database successfully seeded with real events and Founder account!');
  } catch (error) {
    console.error('❌ Error during SKCET database seeding:', error);
  }
};

export const autoSeedIfEmpty = async () => {
  try {
    const eventCount = await Event.countDocuments();
    if (eventCount === 0) {
      console.log('⚡ SKCET database empty. Auto-seeding initial data...');
      await seedDatabase();
    } else {
      console.log(`ℹ️ SKCET database contains ${eventCount} events.`);
    }
  } catch (error) {
    console.error('Error in autoSeedIfEmpty:', error.message);
  }
};

if (process.argv[1]?.endsWith('seed.js')) {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/college_events';
  mongoose
    .connect(mongoUri)
    .then(async () => {
      await seedDatabase();
      process.exit(0);
    })
    .catch(async () => {
      console.log('Connecting via in-memory server to seed...');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      await mongoose.connect(mongod.getUri());
      await seedDatabase();
      process.exit(0);
    });
}
