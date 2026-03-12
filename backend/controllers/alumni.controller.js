const db = require('../config/db');

exports.getAllAlumni = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT ap.*, u.email, u.role 
       FROM alumni_profiles ap 
       JOIN users u ON u.user_id = ap.user_id`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching alumni', error: err.message });
  }
};

exports.getAlumniById = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT ap.*, u.email FROM alumni_profiles ap 
       JOIN users u ON u.user_id = ap.user_id 
       WHERE ap.profile_id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Alumni not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching alumni', error: err.message });
  }
};

exports.createAlumni = async (req, res) => {
  try {
    const { user_id, full_name, graduation_year, degree, department, phone, current_city, linkedin_url } = req.body;
    const [result] = await db.execute(
      `INSERT INTO alumni_profiles (user_id, full_name, graduation_year, degree, department, phone, current_city, linkedin_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, full_name, graduation_year, degree, department, phone, current_city, linkedin_url]
    );
    res.status(201).json({ message: 'Alumni created', profile_id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Error creating alumni', error: err.message });
  }
};
