const express = require('express');
const pool = require('../db');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(verifyToken, requireRole('TEACHER'));

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.id, c.name, c.created_at,
              COUNT(s.id) AS studentCount
       FROM classes c
       LEFT JOIN students s ON s.class_id = c.id
       WHERE c.teacher_id = ?
       GROUP BY c.id
       ORDER BY c.created_at ASC`,
      [req.user.sub]
    );
    res.json({ classes: rows });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name } = req.body || {};
    if (!name || !name.trim()) return res.status(400).json({ error: 'Class name is required.' });

    const [result] = await pool.query(
      'INSERT INTO classes (teacher_id, name) VALUES (?, ?)',
      [req.user.sub, name.trim()]
    );
    res.status(201).json({ class: { id: result.insertId, name: name.trim(), studentCount: 0 } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
