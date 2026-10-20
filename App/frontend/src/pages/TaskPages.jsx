import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StudentTopBar from '../components/StudentTopBar.jsx';
import { MEMORY_INITIALLY_FLIPPED, MEMORY_ITEMS } from '../data/demoData.js';
import useBodyClass from '../hooks/useBodyClass.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { useI18n } from '../i18n/I18nContext.jsx';

// Representative task-type screens (mockups 12–16). The German learning
// content (sentences, words, articles) stays German in both UI languages —
// only instructions and chrome are translated.

function useTaskPage(titleKey) {
  const { t } = useI18n();
  useBodyClass('app-student');
  useDocumentTitle(t(titleKey));
  return t;
}

// Picks an option: wrong answers flash coral, the right one turns mint and
// moves on after a short pause.
function useAnswer(correct, next) {
  const navigate = useNavigate();
  const [picked, setPicked] = useState(null);
  useEffect(() => {
    if (picked !== correct) return undefined;
    const id = setTimeout(() => navigate(next), 700);
    return () => clearTimeout(id);
  }, [picked, correct, next, navigate]);
  return [picked, setPicked];
}

// ---- Type A · storybook (mockup 12) ----
export function StorybookTaskPage() {
  const t = useTaskPage('titles.taskStorybook');

  return (
    <>
      <style>{`
        .stage { min-height: calc(100vh - 84px); display:flex; align-items:center; justify-content:center; padding: 20px 60px; }
        .book {
          display:flex; align-items:center; gap:40px; background:#fff; border-radius:32px; box-shadow: var(--shadow-lg);
          padding:40px; max-width:820px;
        }
        .illustration {
          width:280px; height:280px; border-radius:26px; background: linear-gradient(160deg, var(--sky), var(--mint));
          display:flex; align-items:center; justify-content:center; font-size:120px; flex:none;
        }
        .word-chip { display:inline-flex; align-items:center; gap:8px; background:var(--app-bg); padding:8px 16px; border-radius:14px; font-weight:700; margin-top:14px; }
        .audio-btn {
          width:64px; height:64px; border-radius:50%; background:var(--sun); box-shadow:var(--shadow-sm); border:none; cursor:pointer;
          display:flex; align-items:center; justify-content:center; font-size:28px; margin: 18px auto 0;
        }
        @media (max-width: 900px) { .stage { padding: 20px 16px; } .illustration { width: 200px; height: 200px; font-size: 84px; } }
      `}</style>

      <StudentTopBar title={t('tasks.storybook.title')} progress={20} />

      <div className="stage">
        <div className="book">
          <div className="illustration">🦔🍄</div>
          <div>
            <div className="eyebrow">{t('tasks.storybook.page', { n: 2, total: 5 })}</div>
            <div className="h2" style={{ margin: '8px 0 10px', maxWidth: 340 }}>„Der kleine Igel fand einen Pilz im Wald."</div>
            <div className="muted">{t('tasks.storybook.translation')}</div>
            <div className="word-chip">🔊 der Pilz <span style={{ color: 'var(--ink-faint)', fontWeight: 400 }}>— {t('tasks.storybook.gloss')}</span></div>
            <button className="audio-btn" type="button" aria-label={t('tasks.play')}>▶</button>
            <div style={{ textAlign: 'right', marginTop: 26 }}>
              <Link className="btn btn-lg btn-coral" to="/task/audio-image">{t('tasks.next')} ▶</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ---- Type B · audio → picture (mockup 13) ----
export function AudioToImageTaskPage() {
  const t = useTaskPage('titles.taskAudioImage');
  const [picked, setPicked] = useAnswer('🍎', '/task/audio-choice');

  return (
    <>
      <style>{`
        .stage { min-height: calc(100vh - 84px); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:34px; position:relative; padding: 20px 16px; }
        .prompt-btn {
          width:150px; height:150px; border-radius:50%; background: linear-gradient(160deg, var(--coral), #ff9a8b); border:none; cursor:pointer;
          display:flex; align-items:center; justify-content:center; font-size:64px; box-shadow: var(--shadow-lg); color:#fff;
        }
        .options { display:flex; gap:26px; }
        .opt {
          width:170px; height:170px; border-radius:26px; background:#fff; box-shadow:var(--shadow-md); cursor:pointer;
          display:flex; align-items:center; justify-content:center; font-size:80px; border:5px solid transparent;
        }
        .opt.correct { border-color: var(--mint); }
        .opt.wrong { border-color: var(--coral); }
      `}</style>

      <StudentTopBar title={t('tasks.audioImage.title')} progress={40} />

      <div className="stage">
        <div className="sticker" style={{ top: 60, left: 80 }}>🎧</div>
        <div className="sticker" style={{ top: 60, right: 80 }}>✨</div>

        <button className="prompt-btn" type="button" aria-label={t('tasks.play')}>🔊</button>
        <div className="muted" style={{ fontSize: 16 }}>„{t('tasks.audioImage.instruction')} <b style={{ color: 'var(--ink)' }}>der Apfel</b>"</div>

        <div className="options">
          {['🍇', '🍎', '🍌'].map((opt) => (
            <button
              key={opt}
              type="button"
              className={`opt${picked === opt ? (opt === '🍎' ? ' correct' : ' wrong') : ''}`}
              onClick={() => setPicked(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// ---- Type F_1/F_2 · picture → audio with feedback states (mockup 14) ----
export function AudioChoiceTaskPage() {
  const t = useTaskPage('titles.taskAudioChoice');

  const variants = [
    { tag: 'before', tagStyle: { background: 'var(--app-bg)', color: 'var(--ink-soft)' }, marked: null },
    { tag: 'firstWrong', tagClass: 'pill-coral', marked: 'A', markColor: 'var(--coral)', markBg: 'rgba(255,107,107,.15)', banner: 'pill-coral', bannerText: `😅 ${t('tasks.audioChoice.tryAgain')}` },
    { tag: 'correctSecond', tagClass: 'pill-mint', marked: 'B', markColor: 'var(--mint)', markBg: 'rgba(6,214,160,.15)', banner: 'pill-mint', bannerText: `🎉 ${t('tasks.audioChoice.correct')}` },
  ];

  return (
    <>
      <style>{`
        .stage { padding: 24px 40px 48px; max-width:1180px; margin:0 auto; }
        .variants { display:grid; grid-template-columns: repeat(3, 1fr); gap:20px; }
        .variant { background:#fff; border-radius:24px; padding:26px; box-shadow: var(--shadow-md); text-align:center; }
        .variant .tag { font-size:11.5px; font-weight:700; text-transform:uppercase; letter-spacing:.05em; margin-bottom:14px; display:inline-block; padding:4px 12px; border-radius:999px; }
        .subject { font-size:96px; margin: 6px 0 18px; }
        .audio-opts { display:flex; gap:16px; justify-content:center; }
        .audio-opt {
          width:84px; height:84px; border-radius:50%; background:var(--app-bg); display:flex; align-items:center; justify-content:center;
          font-size:30px; border:4px solid transparent;
        }
        .feedback-banner { margin-top:18px; padding:12px; border-radius:14px; font-weight:700; font-size:14px; }
        @media (max-width: 900px) { .stage { padding: 20px 16px 40px; } }
      `}</style>

      <StudentTopBar title={t('tasks.audioChoice.title')} progress={55} />

      <div className="stage">
        <div className="muted" style={{ textAlign: 'center', marginBottom: 16 }}>🔊 „{t('tasks.audioChoice.instruction')}" — {t('tasks.audioChoice.threeMoments')}</div>
        <div className="variants">
          {variants.map((v) => (
            <div className="variant" key={v.tag}>
              <span className={`tag ${v.tagClass || ''}`} style={v.tagStyle}>{t(`tasks.audioChoice.tags.${v.tag}`)}</span>
              <div className="subject">🐘</div>
              <div className="audio-opts">
                {['A', 'B'].map((o) => (
                  <div
                    key={o}
                    className="audio-opt"
                    style={v.marked === o ? { borderColor: v.markColor, background: v.markBg } : undefined}
                  >
                    🔊 {o}
                  </div>
                ))}
              </div>
              {v.banner && <div className={`feedback-banner ${v.banner}`}>{v.bannerText}</div>}
            </div>
          ))}
        </div>

        <div className="card" style={{ marginTop: 26, textAlign: 'center' }}>
          <span className="pill pill-coral" style={{ whiteSpace: 'normal' }}>⚠️ {t('tasks.audioChoice.remedial')}</span>
        </div>

        <div style={{ textAlign: 'right', marginTop: 22 }}>
          <Link className="btn btn-lg btn-coral" to="/task/grammar">{t('tasks.next')} ▶</Link>
        </div>
      </div>
    </>
  );
}

// ---- Type G1/G2/V_3 · grammar, article choice (mockup 15) ----
export function GrammarTaskPage() {
  const t = useTaskPage('titles.taskGrammar');
  const [picked, setPicked] = useAnswer('Der', '/task/memory');

  return (
    <>
      <style>{`
        .stage { min-height: calc(100vh - 84px); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:26px; padding: 20px 16px; }
        .sentence {
          background:#fff; border-radius:24px; padding:26px 34px; box-shadow: var(--shadow-md); font-family:var(--font-fun);
          font-size:26px; display:flex; align-items:center; gap:14px; flex-wrap:wrap; justify-content:center;
        }
        .gap { border-bottom: 4px dotted var(--ink-faint); min-width:70px; text-align:center; color: var(--ink-faint); }
        .art-illustration { font-size:70px; }
        .article-opts { display:flex; gap:18px; }
        .article-opt {
          width:110px; height:90px; border-radius:20px; background:#fff; box-shadow:var(--shadow-sm); cursor:pointer;
          display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px;
          font-family:var(--font-fun); font-size:26px; font-weight:800; border:4px solid transparent; color:var(--ink);
        }
        .article-opt small { font-family:var(--font-clean); font-size:11px; font-weight:600; color:var(--ink-faint); }
        .article-opt.pick { border-color: var(--sky); background: rgba(76,201,240,.12); }
        .article-opt.wrong { border-color: var(--coral); background: rgba(255,107,107,.12); }
      `}</style>

      <StudentTopBar title={t('tasks.grammar.title')} progress={65} showLogo />

      <div className="stage">
        <div className="art-illustration">🐕</div>
        <div className="sentence">
          <span>{picked === 'Der' ? 'Der' : '___'}</span> <span className="gap">Hund</span> <span>läuft schnell.</span>
        </div>
        <div className="muted">🔊 „{t('tasks.grammar.instruction')}"</div>

        <div className="article-opts">
          {['Der', 'Die', 'Das'].map((a) => (
            <button
              key={a}
              type="button"
              className={`article-opt${picked === a ? (a === 'Der' ? ' pick' : ' wrong') : ''}`}
              onClick={() => setPicked(a)}
            >
              {a} <small>{t('tasks.grammar.case')}</small>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// ---- Type U · memory / suitcase (mockup 16) ----
export function MemoryTaskPage() {
  const t = useTaskPage('titles.taskMemory');
  const [flipped, setFlipped] = useState(() => new Set(MEMORY_INITIALLY_FLIPPED));

  function flip(i) {
    setFlipped((prev) => new Set(prev).add(i));
  }

  return (
    <>
      <style>{`
        .stage { min-height: calc(100vh - 84px); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:24px; padding: 30px 16px 20px; }
        .suitcase {
          width:520px; max-width:100%; background: linear-gradient(160deg, var(--sun), #ffdf8a); border-radius:28px; padding:30px;
          box-shadow: var(--shadow-lg); position:relative;
        }
        .suitcase .handle { position:absolute; top:-22px; left:50%; transform:translateX(-50%); width:90px; height:26px; border-radius:14px 14px 0 0; background:#e0a92b; }
        .grid-cards { display:grid; grid-template-columns: repeat(4, 1fr); gap:14px; }
        .mem-card {
          aspect-ratio: 1; border-radius:16px; background:#fff; box-shadow: var(--shadow-sm); border:none; cursor:pointer;
          display:flex; align-items:center; justify-content:center; font-size:38px; font-family:var(--font-fun); color:var(--ink);
        }
        .mem-card.flipped { background: var(--grape); color:#fff; cursor:default; }
      `}</style>

      <StudentTopBar title={t('tasks.memory.title')} progress={80} showLogo />

      <div className="stage">
        <div className="muted" style={{ fontSize: 16 }}>🔊 „{t('tasks.memory.instruction')}"</div>
        <div className="suitcase">
          <div className="handle"></div>
          <div className="grid-cards">
            {MEMORY_ITEMS.map((item, i) => (
              <button key={i} type="button" className={`mem-card${flipped.has(i) ? ' flipped' : ''}`} onClick={() => flip(i)}>
                {flipped.has(i) ? item : '?'}
              </button>
            ))}
          </div>
        </div>
        <div className="pill pill-grape">🧠 {t('tasks.memory.remembered', { n: flipped.size, total: MEMORY_ITEMS.length })}</div>

        <Link className="btn btn-lg btn-coral" to="/reward?unit=10">{t('tasks.memory.finish')} ▶</Link>
      </div>
    </>
  );
}
