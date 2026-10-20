import { Link } from 'react-router-dom';
import LanguageSwitcher from '../components/LanguageSwitcher.jsx';
import useBodyClass from '../hooks/useBodyClass.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { useI18n } from '../i18n/I18nContext.jsx';

export default function HomePage() {
  const { t } = useI18n();
  useBodyClass('app');
  useDocumentTitle(t('titles.home'));

  return (
    <>
      <style>{`
        .hero { display:flex; min-height:100vh; }
        .hero-copy {
          flex: 1.1; padding: 64px 72px; display:flex; flex-direction:column; justify-content:center; gap:22px;
          background: #fff;
        }
        .hero-art {
          flex: .9; background: linear-gradient(160deg, var(--sky), var(--grape));
          display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden;
        }
        .hero-art .blob {
          width:340px; height:340px; border-radius:50%; background: rgba(255,255,255,.16);
          display:flex; align-items:center; justify-content:center; font-size:150px; overflow:hidden;
        }
        .hero-art .blob img { width:100%; height:100%; object-fit:cover; }
        .brand-lockup { display:flex; align-items:center; gap:12px; }
        .cta-row { display:flex; gap:14px; margin-top:8px; flex-wrap:wrap; }
        .code-card {
          position:absolute; bottom:40px; left:40px; right:40px; background:#fff; border-radius:22px;
          padding:22px 26px; box-shadow: var(--shadow-lg); display:flex; flex-direction:column; align-items:flex-start; gap:16px;
          text-decoration:none; color:inherit;
        }
        .code-card .code-top { display:flex; align-items:center; gap:16px; width:100%; }
        .code-card .code-bottom { display:flex; align-items:center; justify-content:space-between; width:100%; gap:16px; flex-wrap:wrap; }
        .code-card .code-boxes { display:flex; gap:8px; }
        .code-card .code-boxes div {
          width:44px; height:54px; border-radius:12px; background:var(--app-bg); border:2px solid var(--line);
          display:flex; align-items:center; justify-content:center; font-family:var(--font-fun); font-size:22px; color:var(--ink-faint);
        }
        @media (max-width: 900px) {
          .hero-copy { padding: 40px 24px; }
          .hero-art { flex-direction: column; padding: 32px 0; }
          .hero-art .blob { width: 240px; height: 240px; }
          .code-card { position: static; margin: 24px 16px 0; align-self: stretch; }
        }
      `}</style>

      <LanguageSwitcher floating />

      <div className="hero">
        <div className="hero-copy">
          <div className="brand-lockup">
            <img className="logo-mark" src="/img/speak-logo.png" alt="SPEAK" style={{ height: 105 }} />
          </div>
          <div className="h1" style={{ fontSize: 20, fontWeight: 600, maxWidth: 480, marginTop: -8 }}>
            {t('home.welcome')}
          </div>

          <div className="cta-row">
            <Link className="btn btn-lg btn-coral" to="/teacher-login">👩‍🏫 {t('home.teacherLogin')}</Link>
            <Link className="btn btn-lg btn-ghost" to="/teacher-register">✍️ {t('home.teacherRegister')}</Link>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
            <span className="pill pill-sky">🇪🇺 {t('home.pillEu')}</span>
            <span className="pill pill-mint">🔒 {t('home.pillNoEmail')}</span>
            <span className="pill pill-sun">🎧 {t('home.pillAudio')}</span>
          </div>
        </div>

        <div className="hero-art">
          <div className="blob"><img src="/img/speak-gruppe.png" alt={t('home.groupAlt')} /></div>

          <Link className="code-card" to="/student-login">
            <div className="code-top">
              <div style={{ fontSize: 34 }}>🧒</div>
              <div style={{ flex: 1 }}>
                <div className="h3">{t('home.studentCardTitle')}</div>
                <div className="muted">{t('home.studentCardHint')}</div>
              </div>
            </div>
            <div className="code-bottom">
              <div className="code-boxes">
                <div>4</div><div>7</div><div>2</div><div>9</div><div>1</div><div>6</div>
              </div>
              <span className="btn btn-md btn-mint">{t('home.go')} ▶</span>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
