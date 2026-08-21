
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const connectDB = require('./db');

const authRoutes = require('./routes/auth');
const invitationRoutes = require('./routes/invitations');

const app = express();
const PORT = process.env.PORT || 4000;

// CORS
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: '15mb' }));

// Sessions
app.use(session({
  secret: process.env.SESSION_SECRET || 'eventinvite-dev-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 30,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  }
}));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api', invitationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// Serve the built React app in production
const clientDist = path.join(__dirname, '..', 'client', 'dist');

app.use(express.static(clientDist));

// React Router fallback
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }

  res.sendFile(path.join(clientDist, 'index.html'));
});

// Connect to MongoDB and start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`EventInvite server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  });

