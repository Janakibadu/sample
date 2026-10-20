import { Link, useSearchParams } from 'react-router-dom';
import LanguageSwitcher from '../components/LanguageSwitcher.jsx';
import { useStudentAuth } from '../context/StudentAuthContext.jsx';
import useBodyClass from '../hooks/useBodyClass.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { useI18n } from '../i18n/I18nContext.jsx';

// Mockup 17.
export default function RewardPage() {
  const { t } = useI18n();
  useBodyClass('app-student');
  useDocumentTitle(t('titles.reward'));

  const { student } = useStudentAuth();
  const [searchParams] = useSearchParams();
  const unit = ['6', '10', '12'].includes(searchParams.get('unit')) ? searchParams.get('unit') : '10';

  return (
    <>
      <style>{`
        .reward-wrap {
          min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px;
          background: radial-gradient(circle at 30% 20%, rgba(255,201,60,.4), transparent 45%),
                      radial-gradient(circle at 75% 75%, rgba(155,93,229,.28), transparent 45%);
          position:relative; text-align:center; padding: 40px 16px;
        }
        .trophy { font-size:120px; }
        .stat-pills { display:flex; justify-content:center; gap:12px; margin-top:6px; }
      `}</style>

      <LanguageSwitcher floating />

      <div className="reward-wrap">
        <div className="trophy">🏆</div>
        <div className="h1" style={{ fontSize: 32 }}>{t('reward.title', { name: student?.displayName || '' })}</div>
        <div className="muted" style={{ fontSize: 16 }}>{t('reward.completed', { unit: t(`units.u${unit}`) })}</div>

        <div className="stat-pills">
          <span className="pill pill-mint">✅ {t('reward.tasksDone', { done: 5, total: 5 })}</span>
        </div>

        <Link className="btn btn-xl btn-coral" to="/student-home" style={{ marginTop: 22, whiteSpace: 'normal', textAlign: 'center' }}>
          {t('reward.back')} 🏠
        </Link>
      </div>
    </>
  );
}
