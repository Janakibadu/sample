import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../api/client.js';
import TeacherLayout from '../components/TeacherLayout.jsx';
import { useTeacherAuth } from '../context/TeacherAuthContext.jsx';
import useBodyClass from '../hooks/useBodyClass.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { useI18n } from '../i18n/I18nContext.jsx';

function lastActive(value, t) {
  if (!value) return t('classes.lastActive.never');
  const days = Math.floor((Date.now() - new Date(value).getTime()) / 86400000);
  if (days <= 0) return t('classes.lastActive.today');
  if (days === 1) return t('classes.lastActive.yesterday');
  return t('classes.lastActive.daysAgo', { count: days });
}

// Mockups 06, 06a (new class), 06b (add student), 06c (code & QR).
export default function ClassManagementPage() {
  const { t, tServer } = useI18n();
  useBodyClass('app');
  useDocumentTitle(t('titles.classes'));

  const { token } = useTeacherAuth();

  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [students, setStudents] = useState([]);
  const [loadedOnce, setLoadedOnce] = useState(false);
  const [error, setError] = useState('');

  const [newClassOpen, setNewClassOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassError, setNewClassError] = useState('');

  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [addStudentError, setAddStudentError] = useState('');

  const [codeOpen, setCodeOpen] = useState(false);
  const [modalStudent, setModalStudent] = useState(null);
  const [printStudent, setPrintStudent] = useState(null);

  const selectClass = useCallback(async (id) => {
    setSelectedClassId(id);
    try {
      const data = await apiRequest(`/classes/${id}/students`, { token });
      setStudents(data.students);
    } catch (err) {
      setError(err.message);
    }
  }, [token]);

  const loadClasses = useCallback(async () => {
    try {
      const data = await apiRequest('/classes', { token });
      setClasses(data.classes);
      setLoadedOnce(true);
      if (data.classes.length === 0) {
        setStudents([]);
        setSelectedClassId(null);
        return;
      }
      setSelectedClassId((prevSelected) => {
        const stillExists = data.classes.some((c) => c.id === prevSelected);
        const nextId = stillExists ? prevSelected : data.classes[0].id;
        selectClass(nextId);
        return nextId;
      });
    } catch (err) {
      setError(err.message);
    }
  }, [token, selectClass]);

  useEffect(() => {
    loadClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const clear = () => document.body.classList.remove('print-code-card');
    window.addEventListener('afterprint', clear);
    return () => { window.removeEventListener('afterprint', clear); clear(); };
  }, []);

  async function handleCreateClass(e) {
    e.preventDefault();
    setNewClassError('');
    try {
      await apiRequest('/classes', { method: 'POST', token, body: { name: newClassName } });
      setNewClassName('');
      setNewClassOpen(false);
      await loadClasses();
    } catch (err) {
      setNewClassError(err.message);
    }
  }

  async function handleAddStudent(e) {
    e.preventDefault();
    setAddStudentError('');
    try {
      const data = await apiRequest(`/classes/${selectedClassId}/students`, {
        method: 'POST',
        token,
        body: { displayName: studentName },
      });
      setStudentName('');
      setAddStudentOpen(false);
      await loadClasses();
      await selectClass(selectedClassId);
      setModalStudent(data.student);
      setCodeOpen(true);
    } catch (err) {
      setAddStudentError(err.message);
    }
  }

  async function handleRegenerateCode() {
    if (!modalStudent) return;
    try {
      const data = await apiRequest(`/students/${modalStudent.id}/regenerate-code`, {
        method: 'POST',
        token,
      });
      setModalStudent(data.student);
      await selectClass(selectedClassId);
    } catch (err) {
      setError(err.message);
    }
  }

  function handlePrint(student) {
    setPrintStudent(student);
    document.body.classList.add('print-code-card');
    // Let the print-card content commit to the DOM before invoking print.
    requestAnimationFrame(() => window.print());
  }

  const showEmptyState = loadedOnce && (classes.length === 0 || (selectedClassId && students.length === 0));

  return (
    <>
      <style>{`
        .class-tabs { display:flex; gap:10px; margin-bottom:18px; flex-wrap:wrap; }
        .class-tab {
          padding:9px 18px; border-radius:12px; font-weight:700; font-size:13.5px; background:#fff;
          border:1px solid var(--line); color:var(--ink-soft); cursor:pointer; font-family:var(--font-clean);
        }
        .class-tab.active { background:var(--ink); color:#fff; border-color:var(--ink); }
        .class-tab.new-tab { background:transparent; border-style:dashed; }
        .toolbar { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; gap:12px; flex-wrap:wrap; }
        .code-chip { font-family:"Consolas",monospace; background:var(--app-bg); padding:4px 10px; border-radius:8px; font-weight:700; letter-spacing:.06em; }
      `}</style>

      <TeacherLayout active="classes" title={t('nav.classes')}>
        {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{tServer(error)}</div>}

        <div className="class-tabs">
          {classes.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`class-tab${c.id === selectedClassId ? ' active' : ''}`}
              onClick={() => selectClass(c.id)}
            >
              {c.name} · {t('common.studentCount', { count: c.studentCount })}
            </button>
          ))}
          <button type="button" className="class-tab new-tab" onClick={() => setNewClassOpen(true)}>
            ＋ {t('classes.newClass')}
          </button>
        </div>

        <div className="toolbar">
          <span className="muted">{t('classes.toolbarHint')}</span>
          <button className="btn btn-md btn-coral" disabled={!selectedClassId} onClick={() => setAddStudentOpen(true)}>
            ＋ {t('classes.addStudent')}
          </button>
        </div>

        <div className="card table-scroll" style={{ padding: 0 }}>
          <table className="data">
            <tbody>
              <tr><th>{t('classes.displayName')}</th><th>{t('classes.accessCode')}</th><th>{t('classes.status')}</th><th>{t('classes.lastActiveHeader')}</th><th></th></tr>
              {students.map((s) => {
                const active = s.status === 'active';
                return (
                  <tr key={s.id}>
                    <td>🧒 {s.displayName}</td>
                    <td><span className="code-chip">{active ? s.accessCode : '••••••'}</span></td>
                    <td><span className={`pill ${active ? 'pill-mint' : 'pill-coral'}`}>{t(active ? 'classes.active' : 'classes.deactivated')}</span></td>
                    <td>{lastActive(s.lastActiveAt, t)}</td>
                    <td style={{ textAlign: 'right' }}>
                      {active ? (
                        <button className="btn btn-ghost btn-sm" onClick={() => { setModalStudent(s); setCodeOpen(true); }}>
                          {t('classes.codeAndQr')}
                        </button>
                      ) : (
                        <button className="btn btn-ghost btn-sm" disabled title={t('common.comingSoon')}>
                          {t('classes.reactivate')}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {showEmptyState && (
            <div className="empty-state">{t(classes.length === 0 ? 'classes.emptyNoClasses' : 'classes.emptyNoStudents')}</div>
          )}
        </div>

        {selectedClassId && (
          <div style={{ marginTop: 22, textAlign: 'right' }}>
            <Link className="btn btn-md btn-primary" to={`/assignments?classId=${selectedClassId}`}>📌 {t('classes.assignToClass')} ▶</Link>
          </div>
        )}
      </TeacherLayout>

      {newClassOpen && (
        <div className="modal-overlay">
          <form className="modal-card" onSubmit={handleCreateClass}>
            <div className="modal-head">
              <div className="h2">{t('classes.newClass')}</div>
              <button className="modal-close" type="button" title={t('common.close')} onClick={() => setNewClassOpen(false)}>✕</button>
            </div>
            <div className="modal-sub">{t('classes.newClassHint')}</div>
            {newClassError && <div className="alert alert-error" style={{ marginBottom: 14 }}>{tServer(newClassError)}</div>}
            <label className="field-label" htmlFor="class-name">{t('classes.className')}</label>
            <input
              className="field-input"
              id="class-name"
              name="name"
              placeholder={t('classes.classNamePlaceholder')}
              required
              autoFocus
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
            />
            <button type="submit" className="btn btn-lg btn-coral" style={{ width: '100%' }}>{t('classes.createClass')}</button>
          </form>
        </div>
      )}

      {addStudentOpen && (
        <div className="modal-overlay">
          <form className="modal-card" onSubmit={handleAddStudent}>
            <div className="modal-head">
              <div className="h2">{t('classes.addStudent')}</div>
              <button className="modal-close" type="button" title={t('common.close')} onClick={() => setAddStudentOpen(false)}>✕</button>
            </div>
            <div className="modal-sub">{t('classes.addStudentHint')}</div>
            {addStudentError && <div className="alert alert-error" style={{ marginBottom: 14 }}>{tServer(addStudentError)}</div>}
            <label className="field-label" htmlFor="student-name">{t('classes.displayName')}</label>
            <input
              className="field-input"
              id="student-name"
              name="displayName"
              placeholder={t('classes.displayNamePlaceholder')}
              required
              autoFocus
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />
            <button type="submit" className="btn btn-lg btn-coral" style={{ width: '100%' }}>{t('classes.addStudent')}</button>
          </form>
        </div>
      )}

      {codeOpen && modalStudent && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-head">
              <div className="h2">{modalStudent.displayName}</div>
              <button className="modal-close" type="button" title={t('common.close')} onClick={() => setCodeOpen(false)}>✕</button>
            </div>
            <div className="modal-sub">{t('classes.codeHint')}</div>

            <div className="modal-code">
              <div className="code-big">{modalStudent.accessCode}</div>
              <div className="qr-mock" dangerouslySetInnerHTML={{ __html: modalStudent.qrSvg }} />
            </div>

            <div className="modal-actions" style={{ justifyContent: 'center' }}>
              <button className="btn btn-md btn-ghost" style={{ flex: 'none' }} type="button" onClick={handleRegenerateCode}>🔄 {t('classes.regenerate')}</button>
              <button className="btn btn-md btn-primary" style={{ flex: 'none' }} type="button" onClick={() => handlePrint(modalStudent)}>🖨️ {t('common.print')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Printable card (only visible via @media print) */}
      <div className="print-card">
        <img src="/img/speak-logo.png" alt="SPEAK" style={{ height: 60 }} />
        <div className="h2">{printStudent?.displayName}</div>
        <div className="code-big">{printStudent?.accessCode}</div>
        {printStudent && <div dangerouslySetInnerHTML={{ __html: printStudent.qrSvg }} />}
        <div className="muted">{t('classes.printHint')}</div>
      </div>
    </>
  );
}
