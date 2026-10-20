import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiRequest } from '../api/client.js';
import TeacherLayout from '../components/TeacherLayout.jsx';
import { useTeacherAuth } from '../context/TeacherAuthContext.jsx';
import { MODULES } from '../data/demoData.js';
import useBodyClass from '../hooks/useBodyClass.js';
import useClasses from '../hooks/useClasses.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { useI18n } from '../i18n/I18nContext.jsx';

// Mockup 07. Classes and students are live; saving an assignment has no
// endpoint yet, so the final step only confirms the selection.
export default function AssignmentPage() {
  const { t, tServer } = useI18n();
  useBodyClass('app');
  useDocumentTitle(t('titles.assignments'));

  const { token } = useTeacherAuth();
  const [searchParams] = useSearchParams();
  const { classes, error } = useClasses();

  const [moduleId, setModuleId] = useState(null);
  const [target, setTarget] = useState(null); // 'class' | 'student'
  const [classId, setClassId] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [notice, setNotice] = useState(false);

  useEffect(() => {
    if (classes.length === 0 || classId) return;
    const fromQuery = Number(searchParams.get('classId'));
    setClassId(classes.some((c) => c.id === fromQuery) ? fromQuery : classes[0].id);
  }, [classes, classId, searchParams]);

  useEffect(() => {
    if (!classId) return;
    setStudentId('');
    apiRequest(`/classes/${classId}/students`, { token })
      .then((data) => setStudents(data.students.filter((s) => s.status === 'active')))
      .catch(() => setStudents([]));
  }, [classId, token]);

  const selectedClass = classes.find((c) => c.id === classId);
  const step = !moduleId ? 1 : !target ? 2 : 3;
  const ready = moduleId && selectedClass && (target === 'class' || (target === 'student' && studentId));

  return (
    <>
      <style>{`
        .steps { display:flex; gap:10px; margin-bottom:24px; flex-wrap:wrap; }
        .step { display:flex; align-items:center; gap:8px; font-size:13.5px; font-weight:700; color:var(--ink-faint); }
        .step .dot { width:26px; height:26px; border-radius:50%; background:var(--line); color:#fff; display:flex; align-items:center; justify-content:center; font-size:13px; }
        .step.active { color:var(--ink); }
        .step.active .dot { background:var(--coral); }
        .module-grid { display:grid; grid-template-columns: repeat(3, 1fr); gap:14px; margin-bottom:26px; }
        .module-card { padding:18px; cursor:pointer; text-align:left; font-family:var(--font-clean); color:var(--ink); }
        .module-card.selected { border-color:var(--sky); box-shadow: 0 0 0 3px rgba(76,201,240,.25); }
        .target-row { display:flex; gap:14px; }
        .target-card { flex:1; padding:16px; display:flex; align-items:center; gap:12px; cursor:pointer; text-align:left; font-family:var(--font-clean); color:var(--ink); }
        .target-card.selected { border-color:var(--coral); box-shadow: 0 0 0 3px rgba(255,107,107,.2); }
        .inline-select {
          margin-top:6px; height:36px; border-radius:10px; border:2px solid var(--line); padding:0 10px;
          font-family:var(--font-clean); font-size:13.5px; color:var(--ink); background:#fff;
        }
      `}</style>

      <TeacherLayout active="assignments" title={t('assign.title')}>
        {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{tServer(error)}</div>}

        <div className="steps">
          {[1, 2, 3].map((n) => (
            <div key={n} className={`step${step === n ? ' active' : ''}`}><div className="dot">{n}</div> {t(`assign.step${n}`)}</div>
          ))}
        </div>

        <div className="h3" style={{ marginBottom: 12 }}>1. {t('assign.step1')}</div>
        <div className="module-grid">
          {MODULES.map((m) => (
            <button
              key={m.id}
              type="button"
              className={`card module-card${moduleId === m.id ? ' selected' : ''}`}
              onClick={() => setModuleId(m.id)}
            >
              <span className={`pill ${m.pill}`}>{t('assign.unit', { n: m.id })}</span>
              <div className="h3" style={{ marginTop: 10 }}>{t(`areas.${m.area}`)}</div>
              <div className="muted">{t('assign.taskCount', { count: m.taskCount })} · {m.types}</div>
            </button>
          ))}
        </div>

        <div className="h3" style={{ marginBottom: 12 }}>2. {t('assign.assignTo')}</div>
        {classes.length === 0 ? (
          <div className="card empty-state">
            {t('classes.emptyNoClasses')}{' '}
            <Link to="/class-management" style={{ color: 'var(--ink)', fontWeight: 700 }}>{t('nav.classes')}</Link>
          </div>
        ) : (
          <div className="target-row">
            <div
              role="button"
              tabIndex={0}
              className={`card target-card${target === 'class' ? ' selected' : ''}`}
              onClick={() => setTarget('class')}
              onKeyDown={(e) => e.key === 'Enter' && setTarget('class')}
            >
              <div style={{ fontSize: 26 }}>👥</div>
              <div>
                <div className="h3">{t('assign.wholeClass')}</div>
                {classes.length > 1 ? (
                  <select
                    className="inline-select"
                    value={classId ?? ''}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setClassId(Number(e.target.value))}
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>{c.name} · {t('common.studentCount', { count: c.studentCount })}</option>
                    ))}
                  </select>
                ) : (
                  <div className="muted">{selectedClass?.name} · {t('common.studentCount', { count: selectedClass?.studentCount ?? 0 })}</div>
                )}
              </div>
            </div>
            <div
              role="button"
              tabIndex={0}
              className={`card target-card${target === 'student' ? ' selected' : ''}`}
              onClick={() => setTarget('student')}
              onKeyDown={(e) => e.key === 'Enter' && setTarget('student')}
            >
              <div style={{ fontSize: 26 }}>🧒</div>
              <div>
                <div className="h3">{t('assign.singleStudent')}</div>
                {target === 'student' ? (
                  <select
                    className="inline-select"
                    value={studentId}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setStudentId(e.target.value)}
                  >
                    <option value="">{t('assign.chooseStudent')}</option>
                    {students.map((s) => <option key={s.id} value={s.id}>{s.displayName}</option>)}
                  </select>
                ) : (
                  <div className="muted">{t('assign.chooseStudent')}</div>
                )}
              </div>
            </div>
          </div>
        )}

        {notice && <div className="alert alert-info" style={{ marginTop: 22 }}>{t('assign.notSavedYet')}</div>}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 30 }}>
          <Link className="btn btn-md btn-ghost" to="/teacher-dashboard">{t('common.cancel')}</Link>
          <button className="btn btn-md btn-coral" type="button" disabled={!ready} onClick={() => setNotice(true)}>
            {t('assign.submit')} ▶
          </button>
        </div>
      </TeacherLayout>
    </>
  );
}
