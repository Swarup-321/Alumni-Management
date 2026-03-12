const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { email, password, role, full_name, graduation_year, degree, department, phone, current_city } = req.body;

    // 1. Create user
    const hash = await bcrypt.hash(password, 10);
    const [userResult] = await db.execute(
      'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
      [email, hash, role || 'alumni']
    );
    const user_id = userResult.insertId;

    // 2. Create alumni profile ONLY if role is alumni
    if (role === 'alumni' && full_name) {
      await db.execute(
        `INSERT INTO alumni_profiles (user_id, full_name, graduation_year, degree, department, phone, current_city)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [user_id, full_name, graduation_year || 2024, degree || '', department || '', phone || '', current_city || '']
      );
    }

    res.status(201).json({ message: 'Registered successfully', user_id });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ message: 'Wrong password' });

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ message: 'Login successful', token, role: user.role, user_id: user.user_id });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};
