import { Link } from 'react-router-dom';
import TeacherLayout from '../components/TeacherLayout.jsx';
import { useTeacherAuth } from '../context/TeacherAuthContext.jsx';
import { DASHBOARD } from '../data/demoData.js';
import useBodyClass from '../hooks/useBodyClass.js';
import useClasses from '../hooks/useClasses.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { useI18n } from '../i18n/I18nContext.jsx';

const RESULT_PILLS = { completed: 'pill-mint', inProgress: 'pill-sun', needsSupport: 'pill-coral' };

// Mockup 05. Class/student counts are live; the progress figures come from
// demoData until results tracking exists on the server.
export default function TeacherDashboardPage() {
  const { t, tServer } = useI18n();
  useBodyClass('app');
  useDocumentTitle(t('titles.dashboard'));

  const { teacher } = useTeacherAuth();
  const { classes, error } = useClasses();
  const studentTotal = classes.reduce((sum, c) => sum + c.studentCount, 0);

  return (
    <>
      <style>{`
        .grid-stats { display:grid; grid-template-columns: repeat(4, 1fr); gap:16px; margin-bottom:22px; }
        .stat { padding:18px 20px; }
        .stat .num { font-family:var(--font-fun); font-size:30px; font-weight:800; }
        .two-col { display:grid; grid-template-columns: 1.4fr 1fr; gap:20px; }
        .bar-row { display:flex; align-items:center; gap:12px; margin-bottom:14px; }
        .bar-row .name { width:110px; font-size:13.5px; font-weight:600; }
        .bar-row .track { flex:1; }
        .bar-row .pct { width:38px; text-align:right; font-size:13px; color:var(--ink-soft); }
        .chart-donut {
          width:150px; height:150px; border-radius:50%; margin: 6px auto 14px;
          display:flex; align-items:center; justify-content:center;
        }
        .chart-donut span { width:104px; height:104px; border-radius:50%; background:#fff; display:flex; align-items:center; justify-content:center; font-family:var(--font-fun); font-weight:800; font-size:22px;}
      `}</style>

      <TeacherLayout
        active="dashboard"
        title={`${t('dashboard.greeting', { name: teacher?.fullName || '' })} 👋`}
        actions={<span className="pill pill-sky">🇪🇺 {t('dashboard.euHosted')}</span>}
      >
        {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{tServer(error)}</div>}

        <div className="grid-stats">
          <div className="card stat"><div className="muted">{t('dashboard.statClasses')}</div><div className="num">{classes.length}</div></div>
          <div className="card stat"><div className="muted">{t('dashboard.statStudents')}</div><div className="num">{studentTotal}</div></div>
          <div className="card stat"><div className="muted">{t('dashboard.statModules')}</div><div className="num">{DASHBOARD.assignedModules}</div></div>
          <div className="card stat"><div className="muted">{t('dashboard.statCompletion')}</div><div className="num" style={{ color: 'var(--mint-ink)' }}>{DASHBOARD.avgCompletion}%</div></div>
        </div>

        <div className="two-col">
          <div className="card">
            <div className="h3" style={{ marginBottom: 16 }}>{t('dashboard.classCompletion', { unit: t('units.u10') })}</div>
            {DASHBOARD.classCompletion.map((row) => (
              <div className="bar-row" key={row.name}>
                <div className="name">{row.name}</div>
                <div className="track progress-track"><div className="progress-fill" style={{ width: `${row.pct}%`, background: row.color }}></div></div>
                <div className="pct">{row.pct}%</div>
              </div>
            ))}

            <div className="h3" style={{ margin: '22px 0 14px' }}>{t('dashboard.recentActivity')}</div>
            <div className="table-scroll">
              <table className="data">
                <tbody>
                  <tr><th>{t('table.student')}</th><th>{t('table.module')}</th><th>{t('table.task')}</th><th>{t('table.result')}</th></tr>
                  {DASHBOARD.recentActivity.map((row) => (
                    <tr key={row.student}>
                      <td>🧒 {row.student}</td>
                      <td>{row.module} {t(`areas.${row.area}`)}</td>
                      <td>{row.task} {t(`taskNames.${row.taskKey}`)}</td>
                      <td>
                        <span className={`pill ${RESULT_PILLS[row.result]}`}>
                          {t(`dashboard.results.${row.result}`)}{row.score ? ` ${row.score}` : ''}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div className="h3">{t('dashboard.overall')}</div>
            <div
              className="chart-donut"
              style={{ background: `conic-gradient(var(--mint) 0 ${DASHBOARD.overallCompletion}%, var(--line) ${DASHBOARD.overallCompletion}% 100%)` }}
            >
              <span>{DASHBOARD.overallCompletion}%</span>
            </div>
            <div className="muted">{t('dashboard.overallHint')}</div>
            <Link className="btn btn-md btn-primary" to="/results" style={{ width: '100%', marginTop: 16 }}>📄 {t('dashboard.viewAllResults')}</Link>
          </div>
        </div>
      </TeacherLayout>
    </>
  );
}
