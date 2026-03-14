const db = require('../config/db');

exports.getAllMentorships = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT m.*, 
        u1.email AS mentor_email, 
        u2.email AS mentee_email 
       FROM mentorship m
       JOIN users u1 ON m.mentor_id = u1.user_id
       JOIN users u2 ON m.mentee_id = u2.user_id`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createMentorship = async (req, res) => {
  const { mentor_id, mentee_id, domain, start_date } = req.body;
  try {
    await db.execute(
      `INSERT INTO mentorship (mentor_id, mentee_id, domain, start_date, status) 
       VALUES (?, ?, ?, ?, 'active')`,
      [mentor_id, mentee_id, domain, start_date]
    );
    res.json({ message: 'Mentorship created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
