import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTeacherAuth } from '../context/TeacherAuthContext.jsx';
import { useI18n } from '../i18n/I18nContext.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';

const NAV = [
  { key: 'dashboard', to: '/teacher-dashboard', icon: '🏠' },
  { key: 'classes', to: '/class-management', icon: '👥' },
  { key: 'assignments', to: '/assignments', icon: '📌' },
  { key: 'results', to: '/results', icon: '📊' },
  { key: 'contentImport', to: '/content-import', icon: '📦' },
];

// Sidebar + top bar shell shared by every teacher screen (mockups 05–09).
export default function TeacherLayout({ active, title, actions, showAvatar = true, children }) {
  const navigate = useNavigate();
  const { teacher, logout } = useTeacherAuth();
  const { t } = useI18n();

  const initials = useMemo(() => {
    const name = teacher?.fullName || '?';
    return name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase() || '?';
  }, [teacher]);

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="app-shell">
      <div className="sidebar">
        <img className="logo-mark" src="/img/speak-logo.png" alt="SPEAK" style={{ height: 65, marginBottom: 20 }} />
        {NAV.map((item) => (
          <Link key={item.key} className={`nav-item${active === item.key ? ' active' : ''}`} to={item.to}>
            <span className="ic">{item.icon}</span> {t(`nav.${item.key}`)}
          </Link>
        ))}
        <div className="nav-spacer"></div>
        <div className="nav-foot">
          <button className="nav-item" type="button" onClick={handleLogout}>
            <span className="ic">🚪</span> {t('nav.logout')}
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div className="topbar">
          <div className="h3">{title}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {actions}
            <LanguageSwitcher />
            {showAvatar && (
              <button className="avatar" type="button" title={t('nav.logout')} onClick={handleLogout}>
                {initials}
              </button>
            )}
          </div>
        </div>

        <div className="main">{children}</div>
      </div>
    </div>
  );
}
