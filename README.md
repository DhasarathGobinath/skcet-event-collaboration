# SKCET EventCollab 🎓🚀
### Sri Krishna College of Engineering and Technology (SKCET)
**Founded & Developed by [Dhasarath Gobinath](https://github.com/DhasarathGobinath)**

---

A full-stack **MERN (MongoDB, Express, React, Node.js)** web platform built exclusively for students and departments of **Sri Krishna College of Engineering and Technology (SKCET)** to collaborate on Smart India Hackathon (SIH 2026) internal selection rounds, departmental project exhibitions, and technical symposia.

---

## 🌟 Featured SKCET Events

1. **Department Level SIH 2026 Selection**
   - **Dates**: `15/09/2026 - 16/09/2026`
   - **Organized by**: SKCET SIH Committee & Innovation Cell
   - **Venue**: Department Seminar Halls & Computing Labs
   - **Focus**: Internal department screening for SIH 2026 problem statements. Students form inter-disciplinary teams across CSE, IT, ECE, EEE, and Mechanical.
   - **Open Vacancies**: Full Stack / AI Prototype Lead, UI/UX & Pitch Deck Designer, Hardware & IoT Specialist.

2. **Project Expo by ECE Department (Engineer's Day Special)**
   - **Date**: `15/09/2026`
   - **Organized by**: Department of Electronics & Communication Engineering (ECE), SKCET
   - **Venue**: ECE Block Labs & Main Central Courtyard
   - **Focus**: National Engineer's Day exhibition showcasing Embedded Systems, VLSI, Robotics, and IoT prototypes.
   - **Open Vacancies**: Circuit & Embedded Testing Coordinator, Project Expo Event Manager, Documentation Lead.

3. **College Level SIH 2026 Selection**
   - **Dates**: `18/09/2026 - 19/09/2026`
   - **Organized by**: SKCET Central Hackathon Council
   - **Venue**: SKCET Vankatram Hall & Central Computing Center
   - **Focus**: Grand institutional finals to determine official nominee teams representing SKCET at the national Smart India Hackathon.
   - **Open Vacancies**: Sprint Mentor & Technical Evaluator, Stage & Presentation Pitch Coach, Central Hackathon Logistics Volunteer.

---

## 👤 Founder Profile

- **Founder**: **Dhasarath Gobinath**
- **Institution**: Sri Krishna College of Engineering and Technology (SKCET)
- **Email**: `dhasarathgobinath2007@gmail.com`
- **Default Password**: `skcet2026`
- **Role**: Platform Founder & Chief Administrator

---

## 📁 Clean & Modular Code Structure (Visual Studio Code)

```
mernproject/
├── package.json              # Root script runner
├── README.md                 # Project documentation
├── .gitignore                # Excludes node_modules, .env, and dist
│
├── server/                   # Backend Module (Express & MongoDB)
│   ├── package.json
│   ├── server.js             # API entry & DB fallback connection
│   ├── .env.example          # Environment variables template
│   ├── models/               # Simple, readable Mongoose schemas
│   │   ├── User.js           # Student & Founder profile schema
│   │   ├── Event.js          # SKCET Event schema with open roles & discussion
│   │   └── Application.js    # Collaboration requests schema
│   ├── routes/               # Express REST route controllers
│   │   ├── auth.js           # Registration, login, & profile update
│   │   ├── events.js         # Event CRUD, comments & role additions
│   │   ├── applications.js   # Student applications & organizer review
│   │   └── users.js          # Student directory endpoints
│   ├── middleware/
│   │   └── auth.js           # JWT verification middleware
│   └── scripts/
│       └── seed.js           # SKCET database seeder (SIH & ECE Expo)
│
└── client/                   # Frontend Module (React 18 & Vite)
    ├── package.json
    ├── vite.config.js        # Vite dev config with API proxy
    ├── index.html            # Web shell with Plus Jakarta Sans font
    └── src/
        ├── main.jsx          # React DOM entry
        ├── App.jsx           # Clean page routing and state
        ├── index.css         # Custom responsive design system (dark/indigo)
        ├── context/
        │   └── AuthContext.jsx # Real authentication state management
        ├── services/
        │   └── api.js        # Lightweight Fetch API helper
        ├── components/       # Reusable UI modules
        │   ├── Navbar.jsx    # Top navigation with Founder badge
        │   ├── Footer.jsx    # Footer with SKCET & Founder credits
        │   ├── EventCard.jsx # Event display cards with open roles
        │   └── ApplyModal.jsx# Collaboration application modal dialog
        └── pages/            # Application views
            ├── HomePage.jsx          # SKCET Hero banner, metrics & event showcase
            ├── EventsPage.jsx        # Search, filters, and SKCET events grid
            ├── EventDetailPage.jsx   # Event overview, vacancies, roster & discussion
            ├── CreateEventPage.jsx   # Host new department event & role builder
            ├── CollaborationsPage.jsx# Applications tracker & review hub
            ├── DirectoryPage.jsx     # Student talent directory across departments
            └── LoginPage.jsx         # SKCET Student Registration & Sign In
```

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18 or newer)
- npm

### 1. Run Backend Server
```bash
cd server
npm run dev
```
> Running on **`http://localhost:5000`**

### 2. Run Frontend Client
In a new terminal:
```bash
cd client
npm run dev
```
> Live on **`http://localhost:5173`**

---

## 🌐 Publish to GitHub

To push this project to your GitHub account (`DhasarathGobinath`):

1. Create a new repository on [GitHub](https://github.com/new) named **`skcet-event-collaboration`** (leave it empty without initializing README).
2. Run the following commands in your project root (`d:\mernproject`):

```bash
git remote add origin https://github.com/DhasarathGobinath/skcet-event-collaboration.git
git branch -M main
git push -u origin main
```
