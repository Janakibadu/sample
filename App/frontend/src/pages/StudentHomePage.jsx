import { Link, useNavigate } from 'react-router-dom';
import LanguageSwitcher from '../components/LanguageSwitcher.jsx';
import { useStudentAuth } from '../context/StudentAuthContext.jsx';
import { STUDENT_STARS, STUDENT_UNITS } from '../data/demoData.js';
import useBodyClass from '../hooks/useBodyClass.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { useI18n } from '../i18n/I18nContext.jsx';

// Mockup 10. Units/progress/stars are sample data until assignments exist.
export default function StudentHomePage() {
  const { t } = useI18n();
  useBodyClass('app-student');
  useDocumentTitle(t('titles.studentHome'));

  const navigate = useNavigate();
  const { student, logout } = useStudentAuth();

  function handleSignOut() {
    logout();
    navigate('/');
  }

  return (
    <>
      <style>{`
        .tile-grid { display:grid; grid-template-columns: repeat(3, 1fr); gap:22px; margin-top:10px; max-width:1100px; }
        .tile .icon { font-size:44px; }
        .tile .lock { font-size:30px; opacity:.6; }
      `}</style>

      <div className="student-top">
        <img className="logo-mark" src="/img/speak-logo.png" alt="SPEAK" style={{ height: 64 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span className="pill pill-sun">⭐ {t('student.stars', { count: STUDENT_STARS })}</span>
          <LanguageSwitcher />
          <button className="avatar" type="button" style={{ background: 'var(--coral)' }} title={t('nav.logout')} onClick={handleSignOut}>🧒</button>
        </div>
      </div>

      <div className="student-main" style={{ position: 'relative' }}>
        <div className="h1" style={{ fontSize: 30 }}>{t('student.hello', { name: student?.displayName || '' })}</div>
        <div className="muted" style={{ fontSize: 15, marginBottom: 6 }}>🔊 „{t('student.tapCard')}"</div>

        <div className="tile-grid">
          {STUDENT_UNITS.map((u) => {
            const body = (
              <>
                <div className={`icon${u.locked ? ' lock' : ''}`}>{u.icon}</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 19 }}>{t(`units.u${u.id}`)}</div>
                  {u.locked ? (
                    <div className="muted" style={{ color: 'rgba(255,255,255,.9)' }}>{t('student.notAssigned')}</div>
                  ) : (
                    <div className="progress-track" style={{ background: 'rgba(255,255,255,.35)', marginTop: 8 }}>
                      <div className="progress-fill" style={{ width: `${u.progress}%`, background: '#fff' }}></div>
                    </div>
                  )}
                </div>
              </>
            );
            const style = { color: '#fff', background: u.gradient, transform: `rotate(${u.rotate}deg)` };
            return u.locked ? (
              <div key={u.id} className="tile locked" style={style}>{body}</div>
            ) : (
              <Link key={u.id} className="tile" to={u.to} style={style}>{body}</Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
