const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');

const teacherAuthRoutes = require('./routes/teacherAuth');
const classesRoutes = require('./routes/classes');
const studentsRoutes = require('./routes/students');
const studentAuthRoutes = require('./routes/studentAuth');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/teacher', teacherAuthRoutes);
app.use('/api/classes', classesRoutes);
app.use('/api/student', studentAuthRoutes);
app.use('/api', studentsRoutes); // exposes /api/classes/:classId/students, /api/students/:id/regenerate-code

// Hosted deployment (Plesk): serve the built React app from ./public and let
// React Router handle deep links. Skipped when no build is present (local dev).
const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(path.join(publicDir, 'index.html'))) {
  app.use(express.static(publicDir));
  app.get(/^\/(?!api\/).*/, (req, res) => res.sendFile(path.join(publicDir, 'index.html')));
}

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SPEAK API listening on http://localhost:${PORT}`);
});
