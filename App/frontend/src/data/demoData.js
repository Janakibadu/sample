// Sample content for the screens whose backend doesn't exist yet
// (assignments, results, content import, student modules/tasks).
// Taken verbatim from " New Screenmocks" so those screens match the mockups.
// Replace each export with an API call once the matching endpoint lands.
// Display text lives in the i18n dictionaries; this file only holds
// language-neutral data and translation keys.

// Content catalog — the three units that exist in "Speak Programming".
export const MODULES = [
  { id: 6, area: 'vocabulary', pill: 'pill-sky', taskCount: 7, types: 'A, B, F_1, F_2, T, R' },
  { id: 10, area: 'grammar', pill: 'pill-grape', taskCount: 6, types: 'G1, G2, V_3, AT, AV, AX' },
  { id: 12, area: 'grammar', pill: 'pill-sun', taskCount: 6, types: 'G1, G2, U, AT, AV' },
];

export const DASHBOARD = {
  assignedModules: 9,
  avgCompletion: 72,
  overallCompletion: 68,
  classCompletion: [
    { name: '1A', pct: 82, color: 'var(--mint)' },
    { name: '1B', pct: 64, color: 'var(--sky)' },
    { name: '1C', pct: 41, color: 'var(--sun)' },
  ],
  recentActivity: [
    { student: 'Elli', module: 'W10', area: 'grammar', task: 'G1', taskKey: 'article', result: 'completed', score: '5/5' },
    { student: 'Yusuf', module: 'W6', area: 'vocabulary', task: 'B', taskKey: 'audioImage', result: 'inProgress' },
    { student: 'Lio', module: 'W12', area: 'grammar', task: 'V_3', taskKey: 'cloze', result: 'needsSupport' },
  ],
};

export const RESULTS = [
  { student: 'Elli', unit: 10, area: 'grammar', task: 'G1', taskKey: 'article', attempt: 1, dot: 'var(--mint)', score: '5/5', pill: 'pill-mint', action: 'viewTrials' },
  { student: 'Yusuf', unit: 6, area: 'vocabulary', task: 'B', taskKey: 'audioImage', attempt: 2, dot: 'var(--sun)', score: '4/5', pill: 'pill-sun', action: 'viewTrials' },
  { student: 'Lio', unit: 12, area: 'grammar', task: 'V_3', taskKey: 'cloze', attempt: 3, dot: 'var(--coral)', score: '2/5', pill: 'pill-coral', action: 'resetModule' },
];

export const CONTENT_IMPORT = {
  currentVersion: 'v1.3',
  units: '6, 10, 12',
  report: {
    unit: 12,
    rows: 214,
    files: 5,
    media: 118,
    duplicateAudio: 2,
    missingFile: 'K2_W12_042.png',
    missingIn: 'G2_task.csv',
  },
};

// Student side
export const STUDENT_STARS = 128;

export const STUDENT_UNITS = [
  { id: 6, icon: '📖', progress: 100, to: '/reward?unit=6', gradient: 'linear-gradient(160deg, var(--coral), #ff9a8b)', rotate: -1.5 },
  { id: 10, icon: '🧩', progress: 45, to: '/module/10', gradient: 'linear-gradient(160deg, var(--sky), #7ee8fa)', rotate: 1 },
  { id: 12, icon: '🔒', locked: true, gradient: 'linear-gradient(160deg,#b9bccf,#d6d9ec)', rotate: 1.5 },
];

// Task path of unit 10 (mockup 11).
export const MODULE_PATHS = {
  10: {
    progress: 45,
    stops: [
      { n: 1, type: 'AT', key: 'learnArticles', state: 'done' },
      { n: 2, type: 'G1', key: 'articleRhymes', state: 'done' },
      { n: 3, type: 'G2', key: 'chooseArticle', state: 'current', to: '/task/grammar' },
      { n: 4, type: 'V_3', key: 'clozeSentences', state: 'todo' },
      { n: 5, type: 'AX', key: 'reflection', state: 'todo' },
      { n: 6, key: 'reward', state: 'finish', to: '/reward?unit=10' },
    ],
  },
};

export const MEMORY_ITEMS = ['🧦', '🧸', '🪥', '🧢', '📚', '👕', '🍎', '🕶️'];
export const MEMORY_INITIALLY_FLIPPED = [0, 2, 5];
