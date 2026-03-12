const db = require('../config/db');

exports.getAllMentorships = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT m.*,
        mentor.full_name as mentor_name,
        mentee.full_name as mentee_name
       FROM mentorship m
       JOIN alumni_profiles mentor ON mentor.user_id = m.mentor_id
       JOIN alumni_profiles mentee ON mentee.user_id = m.mentee_id
       ORDER BY m.start_date DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching mentorships', error: err.message });
  }
};

exports.createMentorship = async (req, res) => {
  try {
    const { mentor_id, mentee_id, domain, start_date } = req.body;
    const [result] = await db.execute(
      `INSERT INTO mentorship (mentor_id, mentee_id, domain, start_date) VALUES (?, ?, ?, ?)`,
      [mentor_id, mentee_id, domain, start_date]
    );
    res.status(201).json({ message: 'Mentorship created', mentorship_id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Error creating mentorship', error: err.message });
  }
};
