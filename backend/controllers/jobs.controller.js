const db = require('../config/db');

exports.getAllJobs = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT jp.*, u.email as poster_email 
       FROM job_postings jp 
       JOIN users u ON u.user_id = jp.posted_by
       WHERE jp.is_active = true
       ORDER BY jp.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching jobs', error: err.message });
  }
};

exports.createJob = async (req, res) => {
  try {
    const { posted_by, title, company, location, job_type, description, salary_range, deadline } = req.body;
    const [result] = await db.execute(
      `INSERT INTO job_postings (posted_by, title, company, location, job_type, description, salary_range, deadline)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [posted_by, title, company, location, job_type, description, salary_range, deadline]
    );
    res.status(201).json({ message: 'Job posted', job_id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Error posting job', error: err.message });
  }
};

exports.applyJob = async (req, res) => {
  try {
    const { job_id, applicant_id } = req.body;
    await db.execute(
      `INSERT INTO job_applications (job_id, applicant_id) VALUES (?, ?)`,
      [job_id, applicant_id]
    );
    res.status(201).json({ message: 'Applied successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Already applied or error', error: err.message });
  }
};

// ✅ NEW - Delete Job
exports.deleteJob = async (req, res) => {
  try {
    await db.execute(
      `UPDATE job_postings SET is_active = false WHERE job_id = ?`,
      [req.params.id]
    );
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    console.error('❌ deleteJob error:', err.message);
    res.status(500).json({ message: err.message });
  }
};
