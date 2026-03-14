const db = require('../config/db');

exports.getAllEvents = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT e.*, u.email as creator_email,
       COUNT(er.reg_id) as registered_count
       FROM events e
       JOIN users u ON u.user_id = e.created_by
       LEFT JOIN event_registrations er ON er.event_id = e.event_id
       GROUP BY e.event_id
       ORDER BY e.event_date ASC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching events', error: err.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { title, description, event_date, location, created_by, max_capacity } = req.body;
    const [result] = await db.execute(
      `INSERT INTO events (title, description, event_date, location, created_by, max_capacity)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description, event_date, location, created_by, max_capacity]
    );
    res.status(201).json({ message: 'Event created', event_id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Error creating event', error: err.message });
  }
};

exports.registerEvent = async (req, res) => {
  try {
    const { event_id, user_id } = req.body;
    await db.execute(
      `INSERT INTO event_registrations (event_id, user_id) VALUES (?, ?)`,
      [event_id, user_id]
    );
    res.status(201).json({ message: 'Registered for event' });
  } catch (err) {
    res.status(500).json({ message: 'Already registered or error', error: err.message });
  }
};

// ✅ NEW - Delete Event
exports.deleteEvent = async (req, res) => {
  try {
    await db.execute(`DELETE FROM events WHERE event_id = ?`, [req.params.id]);
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error('❌ deleteEvent error:', err.message);
    res.status(500).json({ message: err.message });
  }
};
