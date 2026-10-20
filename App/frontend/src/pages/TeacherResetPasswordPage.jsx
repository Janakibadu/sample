import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { apiRequest } from '../api/client.js';
import LanguageSwitcher from '../components/LanguageSwitcher.jsx';
import useBodyClass from '../hooks/useBodyClass.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { useI18n } from '../i18n/I18nContext.jsx';

// No mockup for this screen — styled like the teacher login (mockup 03).
export default function TeacherResetPasswordPage() {
  const { t, tServer } = useI18n();
  useBodyClass('app');
  useDocumentTitle(t('titles.reset'));

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

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
      await apiRequest('/teacher/reset-password', {
        method: 'POST',
        body: { token, password, confirmPassword },
      });
      navigate('/teacher-login');
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
        <img className="logo-mark" src="/img/speak-logo.png" alt="SPEAK" style={{ height: 64 }} />
        <div className="h2">{t('reset.title')}</div>
        <div className="muted">{t('reset.subtitle')}</div>

        {!token && (
          <div className="alert alert-error" style={{ width: '100%', maxWidth: 340 }}>{t('reset.missingToken')}</div>
        )}
        {error && <div className="alert alert-error" style={{ width: '100%', maxWidth: 340 }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ marginTop: 10, width: '100%', maxWidth: 340 }}>
          <div className="field">
            <label htmlFor="password">{t('reset.newPassword')}</label>
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
            <label htmlFor="confirmPassword">{t('reset.confirmNewPassword')}</label>
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
            style={{ width: '100%' }}
            disabled={!token}
            data-loading={loading || undefined}
          >
            {loading ? t('reset.submitting') : t('reset.submit')}
          </button>
        </form>

        <div className="muted">
          <Link to="/teacher-login" style={{ color: 'var(--ink)', fontWeight: 700, textDecoration: 'none' }}>← {t('forgot.backToLogin')}</Link>
        </div>
      </div>
    </>
  );
}
