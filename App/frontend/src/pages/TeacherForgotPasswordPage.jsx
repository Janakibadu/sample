import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../api/client.js';
import LanguageSwitcher from '../components/LanguageSwitcher.jsx';
import useBodyClass from '../hooks/useBodyClass.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { useI18n } from '../i18n/I18nContext.jsx';

// No mockup for this screen — styled like the teacher login (mockup 03).
export default function TeacherForgotPasswordPage() {
  const { t, tServer } = useI18n();
  useBodyClass('app');
  useDocumentTitle(t('titles.forgot'));

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const data = await apiRequest('/teacher/forgot-password', {
        method: 'POST',
        body: { email },
      });
      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
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
        <Link className="back-link" to="/teacher-login" style={{ alignSelf: 'center', marginBottom: -6 }}>← {t('forgot.backToLogin')}</Link>
        <img className="logo-mark" src="/img/speak-logo.png" alt="SPEAK" style={{ height: 64 }} />
        <div className="h2">{t('forgot.title')}</div>
        <div className="muted" style={{ maxWidth: 340, textAlign: 'center' }}>{t('forgot.subtitle')}</div>

        {error && <div className="alert alert-error" style={{ width: '100%', maxWidth: 340 }}>{tServer(error)}</div>}
        {message && <div className="alert alert-info" style={{ width: '100%', maxWidth: 340 }}>{tServer(message)}</div>}

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
          <button
            type="submit"
            className="btn btn-lg btn-coral"
            style={{ width: '100%' }}
            data-loading={loading || undefined}
          >
            {loading ? t('forgot.submitting') : t('forgot.submit')}
          </button>
        </form>

        <div className="muted">
          {t('forgot.remembered')}{' '}
          <Link to="/teacher-login" style={{ color: 'var(--ink)', fontWeight: 700, textDecoration: 'none' }}>{t('auth.logIn')}</Link>
        </div>
      </div>
    </>
  );
}
