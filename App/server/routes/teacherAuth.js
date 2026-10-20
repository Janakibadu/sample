const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const pool = require('../db');

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

function hashResetToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function issueTeacherToken(teacher) {
  return jwt.sign({ sub: teacher.id, role: 'TEACHER' }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function publicTeacher(teacher) {
  return { id: teacher.id, fullName: teacher.full_name, email: teacher.email };
}

router.post('/register', async (req, res, next) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body || {};

    if (!fullName || !fullName.trim()) return res.status(400).json({ error: 'Full name is required.' });
    if (!email || !EMAIL_RE.test(email)) return res.status(400).json({ error: 'A valid email address is required.' });
    if (!password || password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    if (password !== confirmPassword) return res.status(400).json({ error: 'Passwords do not match.' });

    const normalizedEmail = email.trim().toLowerCase();
    const [existing] = await pool.query('SELECT id FROM teachers WHERE email = ?', [normalizedEmail]);
    if (existing.length > 0) return res.status(409).json({ error: 'An account with this email already exists.' });

    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO teachers (full_name, email, password_hash) VALUES (?, ?, ?)',
      [fullName.trim(), normalizedEmail, passwordHash]
    );

    const teacher = { id: result.insertId, full_name: fullName.trim(), email: normalizedEmail };
    res.status(201).json({ token: issueTeacherToken(teacher), teacher: publicTeacher(teacher) });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });

    const normalizedEmail = email.trim().toLowerCase();
    const [rows] = await pool.query('SELECT * FROM teachers WHERE email = ?', [normalizedEmail]);
    if (rows.length === 0) return res.status(401).json({ error: 'Incorrect email or password.' });

    const teacher = rows[0];
    if (!teacher.is_active) return res.status(403).json({ error: 'This account has been deactivated.' });

    const ok = await bcrypt.compare(password, teacher.password_hash);
    if (!ok) return res.status(401).json({ error: 'Incorrect email or password.' });

    res.json({ token: issueTeacherToken(teacher), teacher: publicTeacher(teacher) });
  } catch (err) {
    next(err);
  }
});

router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = req.body || {};
    if (!email || !EMAIL_RE.test(email)) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const [rows] = await pool.query('SELECT id FROM teachers WHERE email = ?', [normalizedEmail]);

    // Same response whether or not the address is registered, so this
    // endpoint can't be used to discover which emails have accounts.
    if (rows.length > 0) {
      const teacher = rows[0];
      const rawToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = hashResetToken(rawToken);
      const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

      await pool.query(
        'UPDATE teachers SET reset_token_hash = ?, reset_token_expires_at = ? WHERE id = ?',
        [tokenHash, expiresAt, teacher.id]
      );

      const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/teacher-reset-password?token=${rawToken}`;

      // No transactional-email provider is wired up yet — the API to send
      // this will be chosen at hosting time. Until then the link is printed
      // here so it can be picked up manually during development.
      console.log(`\n[SPEAK] Password reset requested for ${normalizedEmail}`);
      console.log(`[SPEAK] Reset link (valid 1 hour): ${resetLink}\n`);
    }

    res.json({ message: 'If that email is registered, a password reset link has been sent.' });
  } catch (err) {
    next(err);
  }
});

router.post('/reset-password', async (req, res, next) => {
  try {
    const { token, password, confirmPassword } = req.body || {};
    if (!token) return res.status(400).json({ error: 'Reset token is required.' });
    if (!password || password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    if (password !== confirmPassword) return res.status(400).json({ error: 'Passwords do not match.' });

    const tokenHash = hashResetToken(token);
    const [rows] = await pool.query(
      'SELECT id FROM teachers WHERE reset_token_hash = ? AND reset_token_expires_at > NOW()',
      [tokenHash]
    );
    if (rows.length === 0) {
      return res.status(400).json({ error: 'This reset link is invalid or has expired.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await pool.query(
      'UPDATE teachers SET password_hash = ?, reset_token_hash = NULL, reset_token_expires_at = NULL WHERE id = ?',
      [passwordHash, rows[0].id]
    );

    res.json({ message: 'Your password has been reset. You can now log in.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
