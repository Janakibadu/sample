import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { apiRequest } from '../api/client.js';
import LanguageSwitcher from '../components/LanguageSwitcher.jsx';
import { useStudentAuth } from '../context/StudentAuthContext.jsx';
import useBodyClass from '../hooks/useBodyClass.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { useI18n } from '../i18n/I18nContext.jsx';

const CODE_LENGTH = 6;

export default function StudentLoginPage() {
  const { t, tServer } = useI18n();
  useBodyClass('app-student');
  useDocumentTitle(t('titles.studentLogin'));

  const navigate = useNavigate();
  const { login } = useStudentAuth();

  const [digits, setDigits] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [mode, setMode] = useState('keypad'); // 'keypad' | 'scan'
  const [scanStatus, setScanStatus] = useState('pointCamera'); // key under studentLogin.scan

  const html5QrCodeRef = useRef(null);
  const scanningRef = useRef(false);

  async function submitCode(code) {
    if (submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const data = await apiRequest('/student/login', { method: 'POST', body: { code } });
      login(data.token, data.student);
      navigate('/student-home');
    } catch (err) {
      setError(err.message);
      setDigits([]);
      setSubmitting(false);
    }
  }

  function pressDigit(digit) {
    if (digits.length >= CODE_LENGTH || submitting) return;
    setDigits((prev) => [...prev, digit]);
  }

  function pressBackspace() {
    if (submitting) return;
    setDigits((prev) => prev.slice(0, -1));
  }

  function pressGo() {
    if (digits.length === CODE_LENGTH) submitCode(digits.join(''));
  }

  function stopScanner() {
    if (html5QrCodeRef.current && scanningRef.current) {
      scanningRef.current = false;
      html5QrCodeRef.current.stop().catch(() => {});
    }
  }

  function startScanner() {
    if (!html5QrCodeRef.current) html5QrCodeRef.current = new Html5Qrcode('qr-reader');
    if (scanningRef.current) return;

    scanningRef.current = true;
    setScanStatus('pointCamera');
    setError('');

    html5QrCodeRef.current
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: 220 },
        (decodedText) => {
          const code = decodedText.trim();
          if (!/^[0-9]{6}$/.test(code)) {
            setScanStatus('notACode');
            return;
          }
          stopScanner();
          setDigits(code.split(''));
          submitCode(code);
        },
        () => {
          // per-frame "no QR found" callback — ignored on purpose
        }
      )
      .catch(() => {
        scanningRef.current = false;
        setScanStatus('noCamera');
      });
  }

  function showKeypad() {
    setMode('keypad');
    stopScanner();
  }

  useEffect(() => {
    if (mode === 'scan') startScanner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  useEffect(() => () => stopScanner(), []);

  return (
    <>
      <style>{`
        .wrap {
          min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:26px;
          background: radial-gradient(circle at 20% 15%, rgba(255,201,60,.35), transparent 40%),
                      radial-gradient(circle at 85% 80%, rgba(76,201,240,.3), transparent 40%);
          position:relative; padding: 80px 16px 40px;
        }
        .code-boxes { display:flex; gap:14px; }
        .code-boxes div {
          width:74px; height:90px; border-radius:20px; background:#fff; border:3px solid var(--line);
          display:flex; align-items:center; justify-content:center; font-family:var(--font-fun); font-size:36px;
          color:var(--ink-faint); box-shadow: var(--shadow-sm);
        }
        .code-boxes div.filled { color:var(--ink); border-color:var(--sky); }
        .keypad { display:grid; grid-template-columns: repeat(3, 84px); gap:14px; }
        .key {
          width:84px; height:84px; border-radius:22px; background:#fff; box-shadow:var(--shadow-sm);
          display:flex; align-items:center; justify-content:center; font-family:var(--font-fun); font-size:26px; color:var(--ink);
          text-decoration:none; border:none; cursor:pointer;
        }
        .key.go { background: var(--mint); color: var(--mint-ink); }
        .key.go:disabled { opacity: .5; cursor: default; }
        #qr-reader { width: min(320px, 90vw); border-radius: 20px; overflow: hidden; box-shadow: var(--shadow-md); background:#fff; }
      `}</style>

      <LanguageSwitcher floating />

      <div className="wrap">
        <Link className="back-link" to="/" style={{ position: 'absolute', top: 28, left: 28 }}>← {t('common.home')}</Link>

        <img className="logo-mark" src="/img/speak-logo.png" alt="SPEAK" style={{ height: 90 }} />
        <div className="h1" style={{ fontSize: 30, textAlign: 'center' }}>{t('studentLogin.title')}</div>

        {error && <div className="alert alert-error">{tServer(error)}</div>}

        {mode === 'keypad' ? (
          <>
            <div className="code-boxes">
              {Array.from({ length: CODE_LENGTH }).map((_, i) => (
                <div key={i} className={digits[i] !== undefined ? 'filled' : ''}>{digits[i] ?? ''}</div>
              ))}
            </div>

            <div className="keypad">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
                <button key={d} className="key" type="button" onClick={() => pressDigit(d)}>{d}</button>
              ))}
              <button className="key" type="button" aria-label={t('studentLogin.delete')} onClick={pressBackspace}>⌫</button>
              <button className="key" type="button" onClick={() => pressDigit('0')}>0</button>
              <button
                className="key go"
                type="button"
                aria-label={t('studentLogin.submit')}
                disabled={digits.length !== CODE_LENGTH || submitting}
                onClick={pressGo}
              >
                ✅
              </button>
            </div>

            <div className="muted" style={{ fontSize: 15, textAlign: 'center' }}>🔊 „{t('studentLogin.hint')}"</div>

            <button className="btn btn-md btn-ghost" type="button" onClick={() => setMode('scan')}>📷 {t('studentLogin.scan.button')}</button>
          </>
        ) : (
          <>
            <div id="qr-reader"></div>
            <div className="muted" style={{ fontSize: 15, maxWidth: 320, textAlign: 'center' }}>
              {scanStatus === 'pointCamera' ? '🔊 „' + t('studentLogin.scan.pointCamera') + '"' : t(`studentLogin.scan.${scanStatus}`)}
            </div>
            <button className="btn btn-md btn-ghost" type="button" onClick={showKeypad}>⌨️ {t('studentLogin.scan.typeInstead')}</button>
          </>
        )}
      </div>
    </>
  );
}
