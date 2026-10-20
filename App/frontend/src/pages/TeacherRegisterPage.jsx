import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/client.js';
import LanguageSwitcher from '../components/LanguageSwitcher.jsx';
import { useTeacherAuth } from '../context/TeacherAuthContext.jsx';
import useBodyClass from '../hooks/useBodyClass.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { useI18n } from '../i18n/I18nContext.jsx';

export default function TeacherRegisterPage() {
  const { t, tServer } = useI18n();
  useBodyClass('app');
  useDocumentTitle(t('titles.register'));

  const navigate = useNavigate();
  const { login } = useTeacherAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('auth.passwordsMismatch'));
      return;
    }

    setLoading(true);
    try {
      const data = await apiRequest('/teacher/register', {
        method: 'POST',
        body: { fullName, email, password, confirmPassword },
      });
      login(data.token, data.teacher);
      navigate('/teacher-dashboard');
    } catch (err) {
      setError(tServer(err.message));
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        .split { display:flex; min-height:100vh; }
        .side {
          flex: .85; background: linear-gradient(160deg, var(--sky), var(--grape));
          display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; color:#fff; position:relative;
          padding: 40px 20px;
        }
        .form-wrap { flex:1.15; display:flex; align-items:center; justify-content:center; padding:40px; }
        .form-card { width:100%; max-width:400px; }
      `}</style>

      <LanguageSwitcher floating />

      <div className="split">
        <div className="side">
          <img className="logo-mark" src="/img/speak-logo.png" alt="SPEAK" style={{ height: 110 }} />
          <div className="h1" style={{ color: '#fff', textAlign: 'center', maxWidth: 260 }}>{t('register.sideTitle')}</div>
          <div style={{ opacity: 0.9, textAlign: 'center', maxWidth: 260, fontSize: 14.5 }}>
            {t('register.sideText')}
          </div>
        </div>

        <div className="form-wrap">
          <div className="form-card">
            <Link className="back-link" to="/" style={{ marginBottom: 14, display: 'inline-flex' }}>← {t('common.home')}</Link>
            <div className="h2" style={{ margin: '6px 0 22px' }}>{t('register.title')}</div>

            {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="fullName">{t('auth.fullName')}</label>
                <input
                  id="fullName"
                  name="fullName"
                  placeholder={t('auth.fullNamePlaceholder')}
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="email">{t('auth.email')}</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t('auth.emailPlaceholder')}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="password">{t('auth.password')}</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••••"
                  minLength={8}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="confirmPassword">{t('auth.confirmPassword')}</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••••"
                  minLength={8}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-lg btn-coral"
                style={{ width: '100%', marginTop: 10 }}
                data-loading={loading || undefined}
              >
                {loading ? t('register.submitting') : t('register.submit')}
              </button>
            </form>
            <div className="muted" style={{ textAlign: 'center', marginTop: 14 }}>
              {t('register.alreadyRegistered')}{' '}
              <Link to="/teacher-login" style={{ color: 'var(--ink)', fontWeight: 700, textDecoration: 'none' }}>{t('auth.logIn')}</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
