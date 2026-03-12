const db = require('../config/db');

exports.getAllDonations = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT d.*, ap.full_name as donor_name
       FROM donations d
       JOIN users u ON u.user_id = d.donor_id
       JOIN alumni_profiles ap ON ap.user_id = u.user_id
       ORDER BY d.donated_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching donations', error: err.message });
  }
};

exports.getDonationStats = async (req, res) => {
  try {
    const [stats] = await db.execute(
      `SELECT 
        COUNT(*) as total_donations,
        SUM(amount) as total_amount,
        AVG(amount) as avg_amount,
        MAX(amount) as max_donation
       FROM donations`
    );
    res.json(stats[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stats', error: err.message });
  }
};

exports.createDonation = async (req, res) => {
  try {
    const { donor_id, amount, purpose, payment_mode } = req.body;
    const [result] = await db.execute(
      `INSERT INTO donations (donor_id, amount, purpose, payment_mode) VALUES (?, ?, ?, ?)`,
      [donor_id, amount, purpose, payment_mode]
    );
    res.status(201).json({ message: 'Donation recorded', donation_id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Error recording donation', error: err.message });
  }
};
