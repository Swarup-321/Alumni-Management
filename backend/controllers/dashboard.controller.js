const db = require('../config/db');

exports.getDashboardStats = async (req, res) => {
  try {
    const [[{ total_alumni }]] = await db.execute(`SELECT COUNT(*) AS total_alumni FROM alumni_profiles`);
    const [[{ total_donations }]] = await db.execute(`SELECT SUM(amount) AS total_donations FROM donations`);
    const [[{ total_users }]] = await db.execute(`SELECT COUNT(*) AS total_users FROM users`);
    const [[{ total_jobs }]] = await db.execute(`SELECT COUNT(*) AS total_jobs FROM jobs`);

    res.json({ total_alumni, total_donations, total_users, total_jobs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GROUP BY graduation year
exports.getAlumniByYear = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT graduation_year, COUNT(*) AS total
      FROM alumni_profiles
      WHERE graduation_year IS NOT NULL
      GROUP BY graduation_year
      ORDER BY graduation_year DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GROUP BY department with HAVING
exports.getAlumniByDepartment = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT department, COUNT(*) AS total
      FROM alumni_profiles
      WHERE department IS NOT NULL
      GROUP BY department
      HAVING COUNT(*) >= 1
      ORDER BY total DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GROUP BY payment mode
exports.getDonationsByMode = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT payment_mode, COUNT(*) AS total_transactions,
             SUM(amount) AS total_amount
      FROM donations
      GROUP BY payment_mode
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// COUNT users per role
exports.getUsersByRole = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT role, COUNT(*) AS total
      FROM users
      GROUP BY role
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Top donors - ORDER BY + LIMIT
exports.getTopDonors = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT ap.full_name, u.email,
             SUM(d.amount) AS total_donated,
             COUNT(*) AS donation_count
      FROM donations d
      JOIN users u ON d.donor_id = u.user_id
      LEFT JOIN alumni_profiles ap ON d.donor_id = ap.user_id
      GROUP BY d.donor_id
      ORDER BY total_donated DESC
      LIMIT 5
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Subquery - alumni who donated
exports.getAlumniWhoDonated = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT full_name, department, graduation_year
      FROM alumni_profiles
      WHERE user_id IN (SELECT DISTINCT donor_id FROM donations)
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Subquery - users who never donated
exports.getUsersNeverDonated = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT u.email, u.role
      FROM users u
      WHERE u.user_id NOT IN (SELECT DISTINCT donor_id FROM donations)
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Date filter - donations this month
exports.getDonationsThisMonth = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT d.*, ap.full_name, u.email
      FROM donations d
      JOIN users u ON d.donor_id = u.user_id
      LEFT JOIN alumni_profiles ap ON d.donor_id = ap.user_id
      WHERE MONTH(d.donated_at) = MONTH(CURRENT_DATE())
      AND YEAR(d.donated_at) = YEAR(CURRENT_DATE())
      ORDER BY d.donated_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Alumni graduated last 5 years
exports.getRecentAlumni = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT full_name, graduation_year, department, current_company
      FROM alumni_profiles
      WHERE graduation_year >= YEAR(CURRENT_DATE()) - 5
      ORDER BY graduation_year DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// AVG, MAX, MIN donation
exports.getDashboardStats = async (req, res) => {
  try {
    const [[{ total_alumni }]] = await db.execute(
      `SELECT COUNT(*) AS total_alumni FROM alumni_profiles`
    );
    const [[{ total_donations }]] = await db.execute(
      `SELECT COALESCE(SUM(amount), 0) AS total_donations FROM donations`
    );
    const [[{ total_users }]] = await db.execute(
      `SELECT COUNT(*) AS total_users FROM users`
    );

    // Safe job count - won't crash if table missing
    let total_jobs = 0;
    try {
      const [[jobRow]] = await db.execute(`SELECT COUNT(*) AS total_jobs FROM jobs`);
      total_jobs = jobRow.total_jobs;
    } catch (e) {
      total_jobs = 0;
    }

    res.json({ total_alumni, total_donations, total_users, total_jobs });
  } catch (err) {
    console.error('❌ getDashboardStats error:', err.message);
    res.status(500).json({ message: err.message });
  }
};


// LIKE search alumni by name
exports.searchAlumni = async (req, res) => {
  try {
    const { q } = req.query;
    const [rows] = await db.execute(`
      SELECT ap.full_name, u.email, ap.department, ap.current_company
      FROM alumni_profiles ap
      JOIN users u ON ap.user_id = u.user_id
      WHERE ap.full_name LIKE ? OR ap.department LIKE ? OR ap.current_company LIKE ?
    `, [`%${q}%`, `%${q}%`, `%${q}%`]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDonationStats = async (req, res) => {
  try {
    const [[stats]] = await db.execute(`
      SELECT 
        COALESCE(AVG(amount), 0) AS avg_donation,
        COALESCE(MAX(amount), 0) AS highest,
        COALESCE(MIN(amount), 0) AS lowest,
        COALESCE(SUM(amount), 0) AS total,
        COUNT(*) AS count
      FROM donations
    `);
    res.json(stats);
  } catch (err) {
    console.error('❌ getDonationStats error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

