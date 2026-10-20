import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/client.js';
import LanguageSwitcher from '../components/LanguageSwitcher.jsx';
import { useTeacherAuth } from '../context/TeacherAuthContext.jsx';
import useBodyClass from '../hooks/useBodyClass.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { useI18n } from '../i18n/I18nContext.jsx';

export default function TeacherLoginPage() {
  const { t, tServer } = useI18n();
  useBodyClass('app');
  useDocumentTitle(t('titles.login'));

  const navigate = useNavigate();
  const { login } = useTeacherAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiRequest('/teacher/login', {
        method: 'POST',
        body: { email, password },
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
        .center { min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:40px; gap:18px; }
        .center .field { width:100%; max-width:340px; margin-bottom:14px; text-align:left; }
      `}</style>

      <LanguageSwitcher floating />

      <div className="center">
        <Link className="back-link" to="/" style={{ alignSelf: 'center', marginBottom: -6 }}>← {t('common.home')}</Link>
        <img className="logo-mark" src="/img/speak-logo.png" alt="SPEAK" style={{ height: 64 }} />
        <div className="h2">{t('login.title')}</div>
        <div className="muted">{t('login.subtitle')}</div>

        {error && <div className="alert alert-error" style={{ width: '100%', maxWidth: 340 }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ marginTop: 10, width: '100%', maxWidth: 340 }}>
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
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <Link className="muted" to="/teacher-forgot-password" style={{ fontSize: 13, textDecoration: 'none' }}>
              {t('login.forgot')}
            </Link>
          </div>
          <button
            type="submit"
            className="btn btn-lg btn-coral"
            style={{ width: '100%' }}
            data-loading={loading || undefined}
          >
            {loading ? t('login.submitting') : t('auth.logIn')}
          </button>
        </form>

        <div className="muted">
          {t('login.newHere')}{' '}
          <Link to="/teacher-register" style={{ color: 'var(--ink)', fontWeight: 700, textDecoration: 'none' }}>{t('home.teacherRegister')}</Link>
        </div>

        <Link className="pill pill-sun" to="/student-login" style={{ marginTop: 6 }}>🧒 {t('login.studentHint')}</Link>
      </div>
    </>
  );
}
