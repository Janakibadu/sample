import { useRef, useState } from 'react';
import TeacherLayout from '../components/TeacherLayout.jsx';
import { CONTENT_IMPORT } from '../data/demoData.js';
import useBodyClass from '../hooks/useBodyClass.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import { useI18n } from '../i18n/I18nContext.jsx';

// Mockup 08. There's no import endpoint yet: picking a file only shows its
// name, and the validation report is the mockup's sample report.
export default function ContentImportPage() {
  const { t } = useI18n();
  useBodyClass('app');
  useDocumentTitle(t('titles.contentImport'));

  const inputRef = useRef(null);
  const [fileName, setFileName] = useState('');
  const [dragging, setDragging] = useState(false);
  const r = CONTENT_IMPORT.report;

  function pickFile(file) {
    if (file) setFileName(file.name);
  }

  return (
    <>
      <style>{`
        .dropzone {
          border: 2.5px dashed var(--line); border-radius:20px; padding:36px; text-align:center; background:#fff;
          margin-bottom:22px; display:block; cursor:pointer;
        }
        .dropzone.dragging { border-color: var(--sky); background: rgba(76,201,240,.06); }
        .report-row { display:flex; align-items:center; gap:12px; padding:10px 4px; border-top:1px solid var(--line); font-size:14px; }
        .report-row:first-child { border-top:none; }
        .ok { color: var(--mint-ink); }
        .warn { color: var(--sun-ink); }
        .err { color: var(--coral-ink); }
        .import-foot { display:flex; justify-content:space-between; align-items:center; gap:16px; flex-wrap:wrap; }
      `}</style>

      <TeacherLayout
        active="contentImport"
        title={t('import.title')}
        showAvatar={false}
        actions={<span className="pill pill-sky">{t('import.currentVersion', { version: CONTENT_IMPORT.currentVersion, units: CONTENT_IMPORT.units })}</span>}
      >
        <label
          className={`dropzone${dragging ? ' dragging' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); pickFile(e.dataTransfer.files[0]); }}
        >
          <input ref={inputRef} type="file" accept=".zip" hidden onChange={(e) => pickFile(e.target.files[0])} />
          <div style={{ fontSize: 40 }}>📦</div>
          <div className="h3" style={{ margin: '10px 0 6px' }}>{t('import.dropTitle')}</div>
          <div className="muted">
            {t('import.or')} <b style={{ color: 'var(--ink)' }}>{t('import.browse')}</b> — {t('import.dropHint')}
          </div>
          {fileName && <div className="pill pill-sky" style={{ marginTop: 14 }}>📎 {fileName}</div>}
        </label>

        {fileName && <div className="alert alert-info" style={{ marginBottom: 22 }}>{t('import.notConnected')}</div>}

        <div className="h3" style={{ marginBottom: 12 }}>
          {t('import.reportTitle', { unit: t(`units.u${r.unit}`) })}
        </div>
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="report-row ok">✅ {t('import.reportRows', { rows: r.rows, files: r.files })}</div>
          <div className="report-row ok">✅ {t('import.reportMedia', { count: r.media })}</div>
          <div className="report-row warn">⚠️ {t('import.reportDuplicate', { count: r.duplicateAudio })}</div>
          <div className="report-row err">⛔ {t('import.reportMissing', { file: r.missingIn, image: r.missingFile })}</div>
        </div>

        <div className="import-foot">
          <div className="muted">{t('import.fixHint')}</div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-md btn-ghost" type="button" onClick={() => { setFileName(''); if (inputRef.current) inputRef.current.value = ''; }}>
              {t('import.discard')}
            </button>
            <button className="btn btn-md disabled" style={{ background: 'var(--line)', color: 'var(--ink-faint)' }} disabled>
              {t('import.publishBlocked')}
            </button>
          </div>
        </div>
      </TeacherLayout>
    </>
  );
}
