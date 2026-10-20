import { LANGUAGES, useI18n } from '../i18n/I18nContext.jsx';

// DE | EN toggle. `floating` pins it to the top-right corner for pages that
// have no top bar of their own.
export default function LanguageSwitcher({ floating = false }) {
  const { lang, setLang, t } = useI18n();

  return (
    <div
      className={`lang-switch${floating ? ' lang-switch-floating' : ''}`}
      role="group"
      aria-label={t('common.language')}
    >
      {LANGUAGES.map((code) => (
        <button
          key={code}
          type="button"
          className={code === lang ? 'active' : ''}
          aria-pressed={code === lang}
          title={t(`common.languageNames.${code}`)}
          onClick={() => setLang(code)}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
