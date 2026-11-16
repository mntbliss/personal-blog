/** Portfolio API base — change for production. */
export const API_BASE = 'https://mntbliss.up.railway.app'; //'http://127.0.0.1:8787';

export const DISCUSS_STORAGE_KEY = 'minty_discuss_codes';
export const DISCUSS_SEEN_KEY = 'minty_discuss_seen';

export function getSavedDiscussCodes() {
  try {
    return JSON.parse(localStorage.getItem(DISCUSS_STORAGE_KEY) || '{}') || {};
  } catch {
    return {};
  }
}

/** Supports legacy string values and `{ accessCode, projectName }`. */
export function normalizeSavedDiscuss(value) {
  if (typeof value === 'string') {
    return { accessCode: value, projectName: '' };
  }
  if (value && typeof value === 'object') {
    return {
      accessCode: String(value.accessCode || ''),
      projectName: String(value.projectName || ''),
    };
  }
  return { accessCode: '', projectName: '' };
}

export function saveDiscussCode(id, accessCode, projectName = '') {
  const map = getSavedDiscussCodes();
  const prev = normalizeSavedDiscuss(map[id]);
  map[id] = {
    accessCode,
    projectName: projectName || prev.projectName || '',
  };
  localStorage.setItem(DISCUSS_STORAGE_KEY, JSON.stringify(map));
}

export function getDiscussCode(id) {
  return normalizeSavedDiscuss(getSavedDiscussCodes()[id]).accessCode;
}

export function getDiscussProjectName(id) {
  return normalizeSavedDiscuss(getSavedDiscussCodes()[id]).projectName;
}

export function getDiscussSeenMap() {
  try {
    return JSON.parse(localStorage.getItem(DISCUSS_SEEN_KEY) || '{}') || {};
  } catch {
    return {};
  }
}

/** Mark discussion as read up to this timestamp (ISO). */
export function markDiscussSeen(id, iso = new Date().toISOString()) {
  const map = getDiscussSeenMap();
  map[id] = iso;
  localStorage.setItem(DISCUSS_SEEN_KEY, JSON.stringify(map));
}

export function getDiscussSeen(id) {
  return getDiscussSeenMap()[id] || '';
}
