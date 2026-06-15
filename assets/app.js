import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyDAcUxeN8DfsBYtg1h_0_90UxDUOrgFYrM',
  authDomain: 'abhyasam-ai.firebaseapp.com',
  projectId: 'abhyasam-ai',
  storageBucket: 'abhyasam-ai.firebasestorage.app',
  messagingSenderId: '198014381698',
  appId: '1:198014381698:web:8bab20f7158daf0b458e9b',
  measurementId: 'G-MPTZBDSW9J'
};

const $ = id => document.getElementById(id);
const store = {
  get(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  },
  set(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
};
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const nowText = () => new Date().toLocaleString();
const nowMs = () => Date.now();

const sections = [
  ['syllabus', 'Syllabus'],
  ['general-studies', 'General Studies'],
  ['english', 'English'],
  ['mathematics', 'Mathematics'],
  ['reasoning', 'Reasoning'],
  ['computer', 'Computer']
];
const validSectionIds = new Set(sections.map(([id]) => id));

const englishModeData = {
  'One Word Substitution': { label: 'One Word Substitution word/phrase', samples: ['philanthropist', 'omniscient', 'bibliophile', 'benevolent'] },
  'Idioms': { label: 'Idiom or phrase', samples: ['break the ice', 'hit the nail on the head', 'once in a blue moon'] },
  'Antonyms & Synonyms': { label: 'Word for antonyms and synonyms', samples: ['diligent', 'prudent', 'mitigate', 'obsolete'] },
  'Spellings': { label: 'Spelling word', samples: ['accommodation', 'committee', 'necessary', 'separate'] },
  'Grammar': { label: 'Grammar topic or rule', samples: ['subject verb agreement', 'tenses', 'active voice', 'direct speech'] }
};

const builtIn = {
  benevolent: { meaning: 'दयालु, परोपकारी', syn: ['kind', 'charitable'], ant: ['cruel', 'selfish'], ex: 'A benevolent officer helped the villagers during the flood.', hi: 'एक दयालु अधिकारी ने बाढ़ के समय ग्रामीणों की मदद की।' },
  diligent: { meaning: 'मेहनती, परिश्रमी', syn: ['hardworking', 'industrious'], ant: ['lazy', 'careless'], ex: 'A diligent aspirant revises vocabulary every day.', hi: 'एक मेहनती अभ्यर्थी रोज़ शब्दावली दोहराता है।' },
  prudent: { meaning: 'समझदार, विवेकपूर्ण', syn: ['wise', 'careful'], ant: ['careless', 'foolish'], ex: 'A prudent decision can save time in the exam.', hi: 'एक विवेकपूर्ण निर्णय परीक्षा में समय बचा सकता है।' },
  mitigate: { meaning: 'कम करना, घटाना', syn: ['reduce', 'lessen'], ant: ['increase', 'worsen'], ex: 'Regular practice can mitigate exam fear.', hi: 'नियमित अभ्यास परीक्षा के डर को कम कर सकता है।' },
  obsolete: { meaning: 'पुराना, अप्रचलित', syn: ['outdated', 'old-fashioned'], ant: ['modern', 'current'], ex: 'Some obsolete words still appear in vocabulary questions.', hi: 'कुछ अप्रचलित शब्द अभी भी शब्दावली प्रश्नों में आते हैं।' },
  philanthropist: { meaning: 'परोपकारी व्यक्ति', syn: ['benefactor', 'humanitarian'], ant: ['miser', 'selfish person'], ex: 'A philanthropist donated books to poor students.', hi: 'एक परोपकारी व्यक्ति ने गरीब छात्रों को किताबें दान कीं।' },
  omniscient: { meaning: 'सर्वज्ञ, सब कुछ जानने वाला', syn: ['all-knowing', 'wise'], ant: ['ignorant', 'unaware'], ex: 'The narrator in the story is omniscient.', hi: 'कहानी का कथावाचक सर्वज्ञ है।' },
  bibliophile: { meaning: 'पुस्तक प्रेमी', syn: ['book lover', 'reader'], ant: ['nonreader', 'book hater'], ex: 'A bibliophile spends most evenings reading.', hi: 'एक पुस्तक प्रेमी अधिकतर शामें पढ़ने में बिताता है।' }
};

let active = normalizeSection(store.get('active-section', 'english'));
let englishMode = englishModeData[store.get('english-mode', 'Antonyms & Synonyms')] ? store.get('english-mode', 'Antonyms & Synonyms') : 'Antonyms & Synonyms';
let current = null;
let auth, db, user, remoteUnsub, syncTimer;
let applyingRemote = false;

function init() {
  renderNav();
  bindEvents();
  renderEnglishModes();
  renderSamples();
  renderSyllabus();
  renderHistory();
  switchSection(active);
  setTheme(store.get('theme', 'light'));
  initFirebase();
}

function bindEvents() {
  $('addSyllabusBtn').onclick = addSyllabus;
  $('clearSyllabusBtn').onclick = clearSyllabus;
  $('generateEnglishBtn').onclick = generateEnglish;
  $('saveEnglishBtn').onclick = saveCurrent;
  $('clearEnglishBtn').onclick = clearEnglish;
  $('saveGsBtn').onclick = saveCurrent;
  $('saveMathBtn').onclick = saveCurrent;
  $('saveReasonBtn').onclick = saveCurrent;
  $('saveComputerBtn').onclick = saveCurrent;
  $('printBtn').onclick = () => window.print();
  $('jsonBtn').onclick = downloadJSON;
  $('clearSavedBtn').onclick = clearSaved;
  $('loginBtn').onclick = login;
  $('logoutBtn').onclick = logout;
  $('syncNowBtn').onclick = () => syncToCloud(true);
  $('syllabusInput').addEventListener('keydown', event => { if (event.key === 'Enter') addSyllabus(); });
  $('engInput').addEventListener('keydown', event => { if (event.key === 'Enter') generateEnglish(); });
  document.querySelectorAll('[data-analyse]').forEach(button => button.onclick = () => analysePaste(button.dataset.analyse));
}

function renderNav() {
  const nav = $('mainNav');
  nav.innerHTML = '';
  sections.forEach(([id, label]) => {
    const button = document.createElement('button');
    button.textContent = label;
    button.id = 'nav-' + id;
    button.type = 'button';
    button.onclick = () => switchSection(id);
    nav.appendChild(button);
  });
  const theme = document.createElement('button');
  theme.className = 'icon-btn';
  theme.id = 'themeBtn';
  theme.type = 'button';
  theme.onclick = toggleTheme;
  nav.appendChild(theme);
}

function normalizeSection(id) {
  if (id === 'computer-mode') return 'computer';
  return validSectionIds.has(id) ? id : 'english';
}

function switchSection(id) {
  id = normalizeSection(id);
  active = id;
  store.set('active-section', id);
  document.querySelectorAll('.section').forEach(section => section.classList.add('hidden'));
  $(id).classList.remove('hidden');
  document.querySelectorAll('#mainNav button:not(.icon-btn)').forEach(button => button.classList.remove('active'));
  $('nav-' + id)?.classList.add('active');
}

function setTheme(theme) {
  theme = theme === 'dark' ? 'dark' : 'light';
  document.body.dataset.theme = theme;
  store.set('theme', theme);
  const button = $('themeBtn');
  if (button) {
    button.textContent = theme === 'dark' ? '☾' : '☀';
    button.title = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
    button.setAttribute('aria-label', button.title);
  }
}
function toggleTheme() { setTheme(document.body.dataset.theme === 'dark' ? 'light' : 'dark'); }

function renderEnglishModes() {
  const box = $('englishModes');
  box.innerHTML = '';
  Object.keys(englishModeData).forEach(mode => {
    const chip = document.createElement('span');
    chip.className = 'chip' + (mode === englishMode ? ' active' : '');
    chip.textContent = mode;
    chip.onclick = () => {
      englishMode = mode;
      store.set('english-mode', mode);
      clearEnglish();
      renderEnglishModes();
      renderSamples();
      $('engLabel').textContent = englishModeData[mode].label;
    };
    box.appendChild(chip);
  });
  $('engLabel').textContent = englishModeData[englishMode].label;
}

function renderSamples() {
  const box = $('engSamples');
  box.innerHTML = '';
  englishModeData[englishMode].samples.forEach(sample => {
    const chip = document.createElement('span');
    chip.className = 'chip';
    chip.textContent = sample;
    chip.onclick = () => { $('engInput').value = sample; generateEnglish(); };
    box.appendChild(chip);
  });
}

function addSyllabus() {
  const text = $('syllabusInput').value.trim();
  if (!text) return;
  const list = store.get('syllabus', []);
  const duplicate = list.some(item => item.text.trim().toLowerCase() === text.toLowerCase());
  if (duplicate) {
    setSyncStatus('This syllabus topic is already in your checklist.');
    return;
  }
  list.push({ id: crypto.randomUUID(), text, done: false, created: nowMs(), updatedMs: nowMs() });
  setSyllabus(list);
  $('syllabusInput').value = '';
}
function clearSyllabus() { if (confirm('Clear syllabus list?')) setSyllabus([]); }
function setSyllabus(list) { store.set('syllabus', list); renderSyllabus(); queueSync(); }
function renderSyllabus() {
  const list = store.get('syllabus', []);
  const done = list.filter(item => item.done).length;
  $('syllabusProgress').textContent = `${done} / ${list.length} completed`;
  const box = $('syllabusList');
  box.innerHTML = list.length ? '' : '<div class="empty-state">No syllabus topics added yet.</div>';
  list.forEach((item, index) => {
    const row = document.createElement('div');
    row.className = 'syllabus-row';
    const check = document.createElement('input');
    check.type = 'checkbox';
    check.checked = !!item.done;
    const span = document.createElement('span');
    span.textContent = item.text;
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'mini-btn no-print';
    remove.textContent = 'Remove';
    check.onchange = event => {
      list[index] = { ...list[index], done: event.target.checked, updatedMs: nowMs() };
      setSyllabus(list);
    };
    remove.onclick = () => {
      const next = list.filter(existing => existing.id !== item.id);
      setSyllabus(next);
    };
    row.append(check, span, remove);
    box.appendChild(row);
  });
}

function analysePaste(type) {
  const ids = { gs: 'gsPaste', math: 'mathPaste', reason: 'reasonPaste', computer: 'computerPaste' };
  const outs = { gs: 'gsOut', math: 'mathOut', reason: 'reasonOut', computer: 'computerOut' };
  const sourceSection = typeToSectionId(type);
  const text = $(ids[type]).value.trim();
  if (!text) {
    setSyncStatus('Paste content first, then organise it.');
    return;
  }
  const title = text.split(/[\n.]/)[0].slice(0, 80) || 'Revision note';
  const subject = detectSubject(type, text);
  const body = `Subject - ${title}\n\nSubject: ${subject}\n\nExam perspective:\n- Keep facts, formulas, definitions, and exceptions separately.\n- Convert long paragraphs into bullet points.\n- Mark PYQ/revision-worthy lines.\n\nClean note:\n${text}`;
  current = { id: crypto.randomUUID(), sourceSection, section: sectionLabel(type), title, body, created: nowText(), createdMs: nowMs() };
  $(outs[type]).innerHTML = `<div class="out-title">${esc(current.section)}</div><div class="out">${esc(body)}</div>`;
}
function typeToSectionId(type) { return { gs: 'general-studies', math: 'mathematics', reason: 'reasoning', computer: 'computer' }[type] || 'english'; }
function sectionLabel(type) { return { gs: 'General Studies', math: 'Mathematics', reason: 'Reasoning', computer: 'Computer' }[type] || type; }
function sectionLabelFromId(id) { return sections.find(section => section[0] === id)?.[1] || id; }
function detectSubject(type, text) {
  const t = text.toLowerCase();
  if (type === 'math') return 'Mathematics';
  if (type === 'reason') return 'Reasoning';
  if (type === 'computer') return 'Computer';
  if (/river|mountain|monsoon|climate|soil|ocean|geography/.test(t)) return 'Geography';
  if (/ancient|medieval|modern|mughal|british|history/.test(t)) return 'History';
  if (/physics|chemistry|biology|cell|force|acid|science/.test(t)) return 'Science';
  if (/constitution|parliament|president|polity/.test(t)) return 'Polity';
  if (/economy|inflation|gdp|budget|tax/.test(t)) return 'Economics';
  if (/environment|biodiversity|pollution/.test(t)) return 'Environment';
  if (/current|appointment|award|scheme/.test(t)) return 'Current Affairs';
  return 'Static GK';
}

function generateEnglish() {
  const term = $('engInput').value.trim();
  if (!term) {
    setSyncStatus('Enter an English word, phrase, or topic first.');
    return;
  }
  const key = term.toLowerCase();
  const data = builtIn[key] || { meaning: 'Hindi meaning to be refined later', syn: ['related word 1', 'related word 2'], ant: ['opposite word 1', 'opposite word 2'], ex: `${term} is useful for exam vocabulary revision.`, hi: 'यह परीक्षा शब्दावली पुनरावृत्ति के लिए उपयोगी है।' };
  const body = `Category: ${englishMode}\nHindi Meaning: ${data.meaning}\nSynonyms: ${data.syn.join(', ')}\nAntonyms: ${data.ant.join(', ')}\nExample: ${data.ex}\nExample Hindi: ${data.hi}`;
  current = { id: `english-${englishMode}-${key}`, sourceSection: 'english', section: 'English', title: term, body, created: nowText(), createdMs: nowMs() };
  $('engOut').innerHTML = cards([
    ['Word / Phrase', term], ['Category', englishMode], ['Hindi Meaning', data.meaning],
    ['Synonyms', data.syn.join(', ')], ['Antonyms', data.ant.join(', ')], ['Example', data.ex], ['Example Hindi', data.hi]
  ]);
}
function cards(rows) { return rows.map(([title, value]) => `<div class="box"><div class="out-title">${esc(title)}</div><div class="out">${esc(value)}</div></div>`).join(''); }
function clearEnglish() {
  $('engInput').value = '';
  $('engOut').innerHTML = '';
  if (current?.sourceSection === 'english') current = null;
}

function saveCurrent() {
  if (!current) {
    setSyncStatus('Nothing to save yet. Generate or organise something first.');
    return;
  }
  if (normalizeSection(current.sourceSection) !== active) {
    setSyncStatus(`Switch back to ${esc(sectionLabelFromId(current.sourceSection))} to save that generated item.`);
    return;
  }
  const items = store.get('saved', []);
  items.unshift({ ...current, id: current.id || crypto.randomUUID() });
  setSaved(dedupe(items));
  setSyncStatus('Saved to revision list.');
  current = null;
}
function setSaved(items) { store.set('saved', items); renderHistory(); queueSync(); }
function renderHistory() {
  const h = $('history');
  const items = store.get('saved', []);
  h.innerHTML = items.length ? '' : '<div class="empty-state">No saved revision entries yet.</div>';
  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<span class="tag">${esc(item.section)}</span><h3>${esc(item.title)}</h3><div class="small">${esc(item.created || '')}</div><div class="out">${esc(item.body)}</div>`;
    h.appendChild(card);
  });
}
function clearSaved() { if (confirm('Clear saved revision list?')) setSaved([]); }
function downloadJSON() {
  const blob = new Blob([JSON.stringify({ saved: store.get('saved', []), syllabus: store.get('syllabus', []) }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'abhyasam-ai-revision.json';
  a.click();
  URL.revokeObjectURL(a.href);
}
function dedupe(items) {
  const seen = new Set();
  return items.filter(item => {
    const key = `${item.section || ''}|${item.title || ''}|${item.body || ''}`.toLowerCase().replace(/\s+/g, ' ').trim();
    const fallback = item.id || key || crypto.randomUUID();
    item.id = item.id || fallback;
    const dedupeKey = key || fallback;
    if (seen.has(dedupeKey)) return false;
    seen.add(dedupeKey);
    return true;
  }).sort((a, b) => (b.createdMs || 0) - (a.createdMs || 0));
}

function setSyncStatus(html) { $('syncStatus').innerHTML = html; }
function localState() { return { saved: store.get('saved', []), syllabus: store.get('syllabus', []) }; }
function applyState(data) {
  applyingRemote = true;
  store.set('saved', dedupe(data.saved || []));
  store.set('syllabus', mergeSyllabus(store.get('syllabus', []), data.syllabus || []));
  renderHistory();
  renderSyllabus();
  applyingRemote = false;
}
async function initFirebase() {
  try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    onAuthStateChanged(auth, handleAuthState);
  } catch (error) {
    setSyncStatus(`Firebase not ready. Local mode is active. ${esc(error.code || '')}`);
  }
}
async function login() {
  try { await signInWithPopup(auth, new GoogleAuthProvider()); }
  catch (error) { setSyncStatus(`Sign-in failed: ${esc(error.code || error.message)}`); }
}
async function logout() { if (auth) await signOut(auth); }
async function handleAuthState(currentUser) {
  user = currentUser;
  if (remoteUnsub) { remoteUnsub(); remoteUnsub = null; }
  if (!user) {
    $('loginBtn').classList.remove('hidden');
    $('logoutBtn').classList.add('hidden');
    $('syncNowBtn').classList.add('hidden');
    setSyncStatus('Local mode. Sign in to sync across devices.');
    return;
  }
  $('loginBtn').classList.add('hidden');
  $('logoutBtn').classList.remove('hidden');
  $('syncNowBtn').classList.remove('hidden');
  setSyncStatus(`Signed in as <strong>${esc(user.email || 'user')}</strong>. Sync starting...`);
  const ref = doc(db, 'users', user.uid, 'state', 'main');
  try {
    const snap = await getDoc(ref);
    const local = localState();
    let merged = local;
    if (snap.exists()) {
      const cloud = snap.data() || {};
      merged = {
        saved: dedupe([...(local.saved || []), ...(cloud.saved || [])]),
        syllabus: mergeSyllabus(local.syllabus || [], cloud.syllabus || [])
      };
      applyState(merged);
    }
    await setDoc(ref, { ...merged, updatedAt: serverTimestamp() }, { merge: true });
    remoteUnsub = onSnapshot(ref, snapshot => {
      if (applyingRemote || !snapshot.exists()) return;
      applyState(snapshot.data() || {});
      setSyncStatus(`Signed in as <strong>${esc(user.email || 'user')}</strong>. Synced.`);
    }, error => {
      setSyncStatus(`Live sync failed: ${esc(error.code || error.message)}`);
    });
    setSyncStatus(`Signed in as <strong>${esc(user.email || 'user')}</strong>. Synced.`);
  } catch (error) {
    setSyncStatus(`Signed in, but sync failed: ${esc(error.code || error.message)}`);
  }
}
function mergeSyllabus(a, b) {
  const map = new Map();
  [...a, ...b].forEach(item => {
    const id = item.id || item.text;
    const normalized = { ...item, id, updatedMs: item.updatedMs || item.created || 0 };
    if (!map.has(id)) {
      map.set(id, normalized);
      return;
    }
    const existing = map.get(id);
    const newer = (normalized.updatedMs || 0) >= (existing.updatedMs || 0) ? normalized : existing;
    map.set(id, { ...existing, ...newer });
  });
  return [...map.values()].sort((x, y) => (y.created || 0) - (x.created || 0));
}
function queueSync() {
  if (applyingRemote || !user || !db) return;
  clearTimeout(syncTimer);
  syncTimer = setTimeout(() => syncToCloud(false), 700);
}
async function syncToCloud(manual) {
  if (!user || !db) { if (manual) setSyncStatus('Sign in first to sync.'); return; }
  try {
    await setDoc(doc(db, 'users', user.uid, 'state', 'main'), { ...localState(), updatedAt: serverTimestamp() }, { merge: true });
    setSyncStatus(`Signed in as <strong>${esc(user.email || 'user')}</strong>. Synced.`);
  } catch (error) {
    setSyncStatus(`Sync failed: ${esc(error.code || error.message)}`);
  }
}

init();