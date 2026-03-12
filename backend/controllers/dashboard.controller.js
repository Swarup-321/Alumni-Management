const db = require('../config/db');

exports.getDashboardStats = async (req, res) => {
  try {
    const [[{ total_alumni }]] = await db.execute('SELECT COUNT(*) as total_alumni FROM alumni_profiles');
    const [[{ total_jobs }]] = await db.execute('SELECT COUNT(*) as total_jobs FROM job_postings WHERE is_active = true');
    const [[{ total_events }]] = await db.execute('SELECT COUNT(*) as total_events FROM events');
    const [[{ total_donations }]] = await db.execute('SELECT COALESCE(SUM(amount), 0) as total_donations FROM donations');
    const [[{ total_mentorships }]] = await db.execute('SELECT COUNT(*) as total_mentorships FROM mentorship WHERE status = "active"');
    const [[{ total_users }]] = await db.execute('SELECT COUNT(*) as total_users FROM users');

    res.json({
      total_alumni,
      total_jobs,
      total_events,
      total_donations,
      total_mentorships,
      total_users
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stats', error: err.message });
  }
};
