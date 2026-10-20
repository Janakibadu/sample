import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import de from './de.js';
import en from './en.js';

// Minimal i18n: two flat-ish dictionaries, dotted keys, {var} interpolation,
// and _one/_other plural variants picked by vars.count. German is the default
// (the product and its mockups are German-first); the choice is remembered.

export const LANGUAGES = ['de', 'en'];
const DICTIONARIES = { de, en };
const STORAGE_KEY = 'speak_lang';

function initialLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (LANGUAGES.includes(saved)) return saved;
  } catch {
    // storage unavailable — fall through to the default
  }
  return 'de';
}

function lookup(dict, key) {
  return key.split('.').reduce((node, part) => (node == null ? undefined : node[part]), dict);
}

function interpolate(text, vars) {
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (match, name) => (vars[name] !== undefined ? vars[name] : match));
}

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(initialLanguage);

  const setLang = useCallback((next) => {
    if (!LANGUAGES.includes(next)) return;
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // not persisted — still switches for this session
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback((key, vars) => {
    const dict = DICTIONARIES[lang];
    let value;
    if (vars && typeof vars.count === 'number') {
      value = lookup(dict, `${key}_${vars.count === 1 ? 'one' : 'other'}`);
    }
    if (value === undefined) value = lookup(dict, key);
    if (value === undefined) value = lookup(DICTIONARIES.en, key);
    if (typeof value !== 'string') return key;
    return interpolate(value, vars);
  }, [lang]);

  // The API answers in English; show the translated text when we know it.
  const tServer = useCallback((message) => {
    const translated = DICTIONARIES[lang].serverMessages?.[message];
    return translated || message;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t, tServer }), [lang, setLang, t, tServer]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
