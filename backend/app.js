const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const alumniRoutes = require('./routes/alumni.routes');
const jobRoutes = require('./routes/jobs.routes');
const eventRoutes = require('./routes/events.routes');
const donationRoutes = require('./routes/donations.routes');
const mentorshipRoutes = require('./routes/mentorship.routes');
const dashboardRoutes = require('./routes/alumni.routes');


const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/mentorship', mentorshipRoutes);

module.exports = app;
