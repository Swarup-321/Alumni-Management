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
    const { user_id, full_name, graduation_year, degree, department, phone, current_city, linkedin_url, current_company } = req.body;
    console.log('Received data:', req.body);
    const [result] = await db.execute(
      `INSERT INTO alumni_profiles (user_id, full_name, graduation_year, degree, department, phone, current_city, linkedin_url, current_company)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, full_name, graduation_year, degree, department, phone, current_city, linkedin_url, current_company]
    );
    res.status(201).json({ message: 'Alumni created', profile_id: result.insertId });
  } catch (err) {
    console.error('Create alumni error:', err.message);
    res.status(500).json({ message: 'Error creating alumni', error: err.message });
  }
};

// Work Experience
exports.addWorkExperience = async (req, res) => {
  const { profile_id, company_name, job_title, start_year, end_year } = req.body;
  try {
    await db.execute(
      `INSERT INTO work_experience (profile_id, company_name, job_title, start_year, end_year) 
       VALUES (?, ?, ?, ?, ?)`,
      [profile_id, company_name, job_title, start_year, end_year]
    );
    res.json({ message: 'Work experience added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getWorkExperience = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT * FROM work_experience WHERE profile_id = ?`,
      [req.params.profile_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Skills
exports.getAllSkills = async (req, res) => {
  try {
    const [rows] = await db.execute(`SELECT * FROM skills`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addAlumniSkill = async (req, res) => {
  const { profile_id, skill_id } = req.body;
  try {
    await db.execute(
      `INSERT IGNORE INTO alumni_skills (profile_id, skill_id) VALUES (?, ?)`,
      [profile_id, skill_id]
    );
    res.json({ message: 'Skill added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAlumniSkills = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT s.skill_name FROM skills s 
       JOIN alumni_skills a ON s.skill_id = a.skill_id 
       WHERE a.profile_id = ?`,
      [req.params.profile_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.updateAlumni = async (req, res) => {
  try {
    const { full_name, graduation_year, degree, department, phone, current_city, linkedin_url, current_company } = req.body;
    await db.execute(
      `UPDATE alumni_profiles SET full_name=?, graduation_year=?, degree=?, department=?, phone=?, current_city=?, linkedin_url=?, current_company=?
       WHERE profile_id=?`,
      [full_name, graduation_year, degree, department, phone, current_city, linkedin_url, current_company, req.params.id]
    );
    res.json({ message: 'Alumni updated successfully' });
  } catch (err) {
    console.error('Update alumni error:', err.message);
    res.status(500).json({ message: 'Error updating alumni', error: err.message });
  }
};
exports.deleteAlumni = async (req, res) => {
  try {
    await db.execute(`DELETE FROM alumni_profiles WHERE profile_id = ?`, [req.params.id]);
    res.json({ message: 'Alumni deleted successfully' });
  } catch (err) {
    console.error('❌ deleteAlumni error:', err.message);
    res.status(500).json({ message: err.message });
  }
};
