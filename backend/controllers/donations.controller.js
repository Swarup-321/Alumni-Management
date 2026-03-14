const db = require('../config/db');

exports.getAllDonations = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT d.*, u.email, ap.full_name
      FROM donations d
      LEFT JOIN users u ON d.donor_id = u.user_id
      LEFT JOIN alumni_profiles ap ON d.donor_id = ap.user_id
      ORDER BY d.donated_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserDonations = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT d.*, u.email, ap.full_name
      FROM donations d
      LEFT JOIN users u ON d.donor_id = u.user_id
      LEFT JOIN alumni_profiles ap ON d.donor_id = ap.user_id
      WHERE d.donor_id = ?
      ORDER BY d.donated_at DESC
    `, [req.params.user_id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createDonation = async (req, res) => {
  try {
    const { user_id, amount, purpose, payment_mode } = req.body;
    await db.execute(
      `INSERT INTO donations (donor_id, amount, purpose, payment_mode) VALUES (?, ?, ?, ?)`,
      [user_id, amount, purpose, payment_mode || 'UPI']
    );
    res.json({ message: 'Donation created successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteDonation = async (req, res) => {
  try {
    await db.execute(`DELETE FROM donations WHERE donation_id = ?`, [req.params.id]);
    res.json({ message: 'Donation deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
