const express = require('express');
const pool = require('../db');
const { verifyToken, requireRole, requireOwnership } = require('../middleware/auth');
const { generateUniqueAccessCode } = require('../utils/accessCode');
const { codeToQrSvg } = require('../utils/qr');

const router = express.Router();

router.use(verifyToken, requireRole('TEACHER'));

function publicStudent(row, qrSvg) {
  return {
    id: row.id,
    displayName: row.display_name,
    accessCode: row.access_code,
    status: row.status,
    lastActiveAt: row.last_active_at,
    qrSvg,
  };
}

router.get('/classes/:classId/students', requireOwnership, async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM students WHERE class_id = ? ORDER BY created_at ASC',
      [req.classId]
    );
    const students = await Promise.all(
      rows.map(async (row) => publicStudent(row, await codeToQrSvg(row.access_code)))
    );
    res.json({ students });
  } catch (err) {
    next(err);
  }
});

router.post('/classes/:classId/students', requireOwnership, async (req, res, next) => {
  try {
    const { displayName } = req.body || {};
    if (!displayName || !displayName.trim()) {
      return res.status(400).json({ error: 'Student name is required.' });
    }

    const accessCode = await generateUniqueAccessCode();
    const [result] = await pool.query(
      'INSERT INTO students (class_id, display_name, access_code) VALUES (?, ?, ?)',
      [req.classId, displayName.trim(), accessCode]
    );

    const [rows] = await pool.query('SELECT * FROM students WHERE id = ?', [result.insertId]);
    const qrSvg = await codeToQrSvg(accessCode);
    res.status(201).json({ student: publicStudent(rows[0], qrSvg) });
  } catch (err) {
    next(err);
  }
});

router.post('/students/:id/regenerate-code', requireOwnership, async (req, res, next) => {
  try {
    const accessCode = await generateUniqueAccessCode();
    await pool.query('UPDATE students SET access_code = ? WHERE id = ?', [accessCode, req.params.id]);

    const [rows] = await pool.query('SELECT * FROM students WHERE id = ?', [req.params.id]);
    const qrSvg = await codeToQrSvg(accessCode);
    res.json({ student: publicStudent(rows[0], qrSvg) });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
