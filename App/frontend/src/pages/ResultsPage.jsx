import { useState } from 'react';
import TeacherLayout from '../components/TeacherLayout.jsx';
import { MODULES, RESULTS } from '../data/demoData.js';
import useBodyClass from '../hooks/useBodyClass.js';
import useClasses from '../hooks/useClasses.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { useI18n } from '../i18n/I18nContext.jsx';

// Mockup 09. Rows are sample data until attempts are recorded server-side;
// the class filter lists the teacher's real classes.
export default function ResultsPage() {
  const { t } = useI18n();
  useBodyClass('app');
  useDocumentTitle(t('titles.results'));

  const { classes } = useClasses();
  const [unit, setUnit] = useState('all');
  const [area, setArea] = useState('all');
  const [classId, setClassId] = useState('all');
  const [student, setStudent] = useState('all');

  const rows = RESULTS.filter((r) =>
    (unit === 'all' || r.unit === Number(unit))
    && (area === 'all' || r.area === area)
    && (student === 'all' || r.student === student));

  return (
    <>
      <style>{`
        .filters { display:flex; gap:10px; margin-bottom:18px; flex-wrap:wrap; }
        .filter {
          padding:9px 16px; border-radius:12px; background:#fff; border:1px solid var(--line); font-size:13.5px; font-weight:600;
          color:var(--ink-soft); display:flex; align-items:center; gap:6px; font-family:var(--font-clean);
        }
        .filter select {
          border:none; background:none; font:inherit; color:inherit; cursor:pointer; outline:none; padding:0;
        }
        .attempt-dot { width:12px; height:12px; border-radius:50%; display:inline-block; }
      `}</style>

      <TeacherLayout
        active="results"
        title={t('results.title')}
        showAvatar={false}
        actions={<button className="btn btn-md btn-primary" type="button" onClick={() => window.print()}>🖨️ {t('results.print')}</button>}
      >
        <div className="filters">
          <label className="filter">
            {t('results.filterUnit')}:
            <select value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="all">{t('results.all')}</option>
              {MODULES.map((m) => <option key={m.id} value={m.id}>{m.id}</option>)}
            </select>
          </label>
          <label className="filter">
            {t('results.filterArea')}:
            <select value={area} onChange={(e) => setArea(e.target.value)}>
              <option value="all">{t('results.all')}</option>
              <option value="vocabulary">{t('areas.vocabulary')}</option>
              <option value="grammar">{t('areas.grammar')}</option>
            </select>
          </label>
          <label className="filter">
            {t('results.filterClass')}:
            <select value={classId} onChange={(e) => setClassId(e.target.value)}>
              <option value="all">{t('results.all')}</option>
              {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label className="filter">
            {t('results.filterStudent')}:
            <select value={student} onChange={(e) => setStudent(e.target.value)}>
              <option value="all">{t('results.all')}</option>
              {RESULTS.map((r) => <option key={r.student} value={r.student}>{r.student}</option>)}
            </select>
          </label>
        </div>

        <div className="card table-scroll" style={{ padding: 0, marginBottom: 20 }}>
          <table className="data">
            <tbody>
              <tr>
                <th>{t('table.student')}</th><th>{t('table.module')}</th><th>{t('table.task')}</th>
                <th>{t('results.attempts')}</th><th>{t('results.points')}</th><th>{t('classes.status')}</th><th></th>
              </tr>
              {rows.map((r) => (
                <tr key={r.student}>
                  <td>🧒 {r.student}</td>
                  <td>W{r.unit} {t(`areas.${r.area}`)}</td>
                  <td>{r.task} {t(`taskNames.${r.taskKey}`)}</td>
                  <td><span className="attempt-dot" style={{ background: r.dot }}></span> {t('results.attemptN', { n: r.attempt })}</td>
                  <td>{r.score}</td>
                  <td><span className={`pill ${r.pill}`}>{t('results.completed')}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <button className={`btn ${r.action === 'resetModule' ? 'btn-outline' : 'btn-ghost'}`} type="button" style={{ height: 32, padding: '0 12px', fontSize: 12 }}>
                      {t(`results.${r.action}`)}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <div className="empty-state">{t('results.empty')}</div>}
        </div>
      </TeacherLayout>
    </>
  );
}
