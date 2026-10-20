import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';

// Top bar of the task screens (mockups 12–16): back link, task title, progress.
export default function StudentTopBar({ title, progress, color = 'var(--sky)', showLogo = false, backTo = '/module/10' }) {
  const { t } = useI18n();

  return (
    <div className="student-top">
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {showLogo && <img className="logo-mark" src="/img/speak-logo.png" alt="SPEAK" style={{ height: 65 }} />}
        <Link className="back-link" to={backTo}>← {t('student.taskPath')}</Link>
      </div>
      <div className="h3">{title}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div className="progress-track" style={{ width: 220 }}>
          <div className="progress-fill" style={{ width: `${progress}%`, background: color }}></div>
        </div>
        <LanguageSwitcher />
      </div>
    </div>
  );
}
