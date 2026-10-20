const jwt = require('jsonwebtoken');
const pool = require('../db');

function verifyToken(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing auth token.' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: 'Not allowed for this account type.' });
    }
    next();
  };
}

// Confirms the teacher in req.user owns the :classId in the route, or the
// class that :studentId belongs to. Attaches the resolved classId to req.
async function requireOwnership(req, res, next) {
  try {
    let classId = req.params.classId;

    if (!classId && req.params.id) {
      const [rows] = await pool.query('SELECT class_id FROM students WHERE id = ?', [req.params.id]);
      if (rows.length === 0) return res.status(404).json({ error: 'Student not found.' });
      classId = rows[0].class_id;
    }

    if (!classId) return res.status(400).json({ error: 'No class reference in request.' });

    const [classRows] = await pool.query('SELECT id, teacher_id FROM classes WHERE id = ?', [classId]);
    if (classRows.length === 0) return res.status(404).json({ error: 'Class not found.' });
    if (classRows[0].teacher_id !== req.user.sub) {
      return res.status(403).json({ error: 'You do not own this class.' });
    }

    req.classId = classRows[0].id;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { verifyToken, requireRole, requireOwnership };
