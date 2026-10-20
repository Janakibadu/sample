const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const router = express.Router();

router.post('/login', async (req, res, next) => {
  try {
    const { code } = req.body || {};
    if (!code || !/^[0-9]{6}$/.test(String(code))) {
      return res.status(400).json({ error: 'Enter your 6-digit code.' });
    }

    const [rows] = await pool.query('SELECT * FROM students WHERE access_code = ?', [code]);
    if (rows.length === 0) return res.status(401).json({ error: "That code doesn't match any student." });

    const student = rows[0];
    if (student.status !== 'active') return res.status(403).json({ error: 'This code is no longer active.' });

    await pool.query('UPDATE students SET last_active_at = NOW() WHERE id = ?', [student.id]);

    const token = jwt.sign(
      { sub: student.id, classId: student.class_id, role: 'STUDENT' },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, student: { id: student.id, displayName: student.display_name } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
