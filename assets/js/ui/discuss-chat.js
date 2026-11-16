import {
  API_BASE,
  getDiscussCode,
  getDiscussProjectName,
  getSavedDiscussCodes,
  markDiscussSeen,
  normalizeSavedDiscuss,
  saveDiscussCode,
} from '../config.js';

const POLL_MS = 2 * 60 * 1000;
const ADMIN_SESSION_KEY = 'minty_admin_key';

export async function api(path, options = {}) {
  const { headers: extraHeaders, ...rest } = options;
  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(extraHeaders || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

function getAdminKey() {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) || '';
}

function setAdminKey(key) {
  if (key) sessionStorage.setItem(ADMIN_SESSION_KEY, key);
  else sessionStorage.removeItem(ADMIN_SESSION_KEY);
}

function adminHeaders() {
  const key = getAdminKey();
  return key ? { 'X-Admin-Key': key } : {};
}

export function initChatsPage() {
  const form = document.getElementById('chats-open-form');
  const input = document.getElementById('chats-code');
  const errorEl = document.getElementById('chats-error');
  const list = document.getElementById('chats-saved');
  const inboxCard = document.getElementById('chats-inbox-card');
  const inbox = document.getElementById('chats-inbox');
  const startBtn = document.getElementById('chats-start');

  const saved = getSavedDiscussCodes();
  const ids = Object.keys(saved);
  if (list) {
    if (!ids.length) {
      list.innerHTML = '<p class="chats-muted">No saved chats on this device yet.</p>';
    } else {
      list.innerHTML = ids
        .map((id) => {
          const meta = normalizeSavedDiscuss(saved[id]);
          const label = meta.projectName || `Chat ${id.slice(0, 8)}…`;
          return `<a class="chats-saved-link" href="./chat.html?id=${encodeURIComponent(id)}">${escapeHtml(label)}</a>`;
        })
        .join('');
    }
  }

  function renderInbox(rows) {
    if (!inboxCard || !inbox) return;
    inboxCard.hidden = false;
    if (!rows.length) {
      inbox.innerHTML = '<p class="chats-muted">No discussions yet.</p>';
      return;
    }
    inbox.innerHTML = rows
      .map((row) => {
        const label =
          row.projectName || row.contact || `Chat ${String(row.id).slice(0, 8)}…`;
        const when = row.updatedAt ? new Date(row.updatedAt).toLocaleString() : '';
        const sub = row.contact && row.projectName ? ` · ${row.contact}` : '';
        return `<a class="chats-saved-link" href="./chat.html?id=${encodeURIComponent(row.id)}">${escapeHtml(label)}<span class="chats-muted">${escapeHtml(sub)} · ${escapeHtml(when)}</span></a>`;
      })
      .join('');
  }

  // Resume admin inbox if session still has the key
  const existingAdmin = getAdminKey();
  if (existingAdmin) {
    api('/api/discussions/open', {
      method: 'POST',
      body: JSON.stringify({ accessCode: existingAdmin }),
    })
      .then((data) => {
        if (data.admin) renderInbox(data.discussions || []);
        else setAdminKey('');
      })
      .catch(() => setAdminKey(''));
  }

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (errorEl) {
      errorEl.hidden = true;
      errorEl.textContent = '';
    }
    const accessCode = String(input?.value || '').trim();
    try {
      const data = await api('/api/discussions/open', {
        method: 'POST',
        body: JSON.stringify({ accessCode }),
      });

      if (data.admin) {
        // session only — never localStorage / URL
        setAdminKey(accessCode);
        if (input) input.value = '';
        renderInbox(data.discussions || []);
        return;
      }

      setAdminKey('');
      saveDiscussCode(data.id, accessCode);
      window.location.href = `./chat.html?id=${encodeURIComponent(data.id)}`;
    } catch (err) {
      if (errorEl) {
        errorEl.hidden = false;
        errorEl.textContent = err.message || 'Could not open chat';
      }
    }
  });

  startBtn?.addEventListener('click', () => {
    window.location.href = './chat.html?new=1';
  });
}

export function initChatPage() {
  const params = new URLSearchParams(window.location.search);
  const isNew = params.get('new') === '1';
  let discussionId = params.get('id') || '';
  const isAdmin = Boolean(getAdminKey());
  let accessCode = !isAdmin && discussionId ? getDiscussCode(discussionId) : '';

  const thread = document.getElementById('chat-thread');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  const projectNameInput = document.getElementById('chat-project-name');
  const contactInput = document.getElementById('chat-contact');
  const titleEl = document.getElementById('chat-title');
  const errorEl = document.getElementById('chat-error');
  const codeEl = document.getElementById('chat-access-code');
  const copyBtn = document.getElementById('chat-copy-code');
  const footer = document.getElementById('chat-footer');

  let pollTimer = null;

  function showError(msg) {
    if (!errorEl) return;
    errorEl.hidden = !msg;
    errorEl.textContent = msg || '';
  }

  function setProjectTitle(name) {
    if (!titleEl) return;
    titleEl.textContent = name ? String(name) : 'Project chat';
  }

  function renderMessages(rows) {
    if (!thread) return;
    thread.innerHTML = rows
      .map((m) => {
        const who = m.role === 'admin' ? 'mntbliss' : isAdmin ? 'Visitor' : 'You';
        const cls = m.role === 'admin' ? 'chat-bubble admin' : 'chat-bubble visitor';
        return `<div class="${cls}"><span class="chat-who">${who}</span><p>${escapeHtml(m.body)}</p></div>`;
      })
      .join('');
    thread.scrollTop = thread.scrollHeight;

    // Visitor opened the thread — clear the portfolio notify dot for this chat
    if (!isAdmin && discussionId && rows.length) {
      const latest = rows.reduce((max, m) => {
        const t = new Date(m.createdAt).getTime();
        return Number.isFinite(t) && t > max ? t : max;
      }, 0);
      markDiscussSeen(discussionId, latest ? new Date(latest).toISOString() : new Date().toISOString());
    }
  }

  function setAccessCode(code) {
    accessCode = code;
    if (codeEl) codeEl.textContent = code;
    if (footer) footer.hidden = !code || isAdmin;
  }

  async function loadMessages() {
    if (!discussionId) return;
    if (isAdmin) {
      const data = await api(`/api/discussions/${encodeURIComponent(discussionId)}`, {
        headers: adminHeaders(),
      });
      if (data.projectName) setProjectTitle(data.projectName);
      renderMessages(data.messages || []);
      return;
    }
    if (!accessCode) return;
    const data = await api(
      `/api/discussions/${encodeURIComponent(discussionId)}?code=${encodeURIComponent(accessCode)}`,
    );
    if (data.projectName) {
      setProjectTitle(data.projectName);
      saveDiscussCode(discussionId, accessCode, data.projectName);
    }
    renderMessages(data.messages || []);
  }

  function startPolling() {
    stopPolling();
    pollTimer = setInterval(() => {
      loadMessages().catch(() => {});
    }, POLL_MS);
  }

  function stopPolling() {
    if (pollTimer) clearInterval(pollTimer);
    pollTimer = null;
  }

  copyBtn?.addEventListener('click', async () => {
    if (!accessCode) return;
    try {
      await navigator.clipboard.writeText(accessCode);
      copyBtn.textContent = 'Copied';
      setTimeout(() => {
        copyBtn.textContent = 'Copy';
      }, 1200);
    } catch {
      /* ignore */
    }
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    showError('');
    const body = String(input?.value || '').trim();
    if (!body) return;

    try {
      if (!discussionId) {
        const projectName = String(projectNameInput?.value || '').trim();
        if (!projectName) {
          showError('Add a project name so this chat is easy to find.');
          return;
        }
        const contact = String(contactInput?.value || '').trim();
        const created = await api('/api/discussions', {
          method: 'POST',
          body: JSON.stringify({ projectName, message: body, contact, website: '' }),
        });
        discussionId = created.id;
        accessCode = created.accessCode;
        saveDiscussCode(discussionId, accessCode, projectName);
        setAccessCode(accessCode);
        setProjectTitle(projectName);
        history.replaceState({}, '', `./chat.html?id=${encodeURIComponent(discussionId)}`);
        if (projectNameInput) projectNameInput.hidden = true;
        if (contactInput) contactInput.hidden = true;
      } else if (isAdmin) {
        await api(`/api/discussions/${encodeURIComponent(discussionId)}/messages`, {
          method: 'POST',
          headers: adminHeaders(),
          body: JSON.stringify({ body, website: '' }),
        });
      } else {
        await api(`/api/discussions/${encodeURIComponent(discussionId)}/messages`, {
          method: 'POST',
          body: JSON.stringify({ body, accessCode, website: '' }),
        });
      }
      if (input) input.value = '';
      await loadMessages();
      startPolling();
    } catch (err) {
      showError(err.message || 'Send failed');
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopPolling();
    else if (discussionId && (accessCode || isAdmin)) {
      loadMessages().catch(() => {});
      startPolling();
    }
  });

  if (isNew || !discussionId) {
    setAccessCode('');
    setProjectTitle('New project chat');
    if (footer) footer.hidden = true;
    if (projectNameInput) projectNameInput.hidden = false;
    if (contactInput) contactInput.hidden = false;
    if (thread) {
      thread.innerHTML =
        '<p class="chats-muted">Name the project, say hi — you\'ll get an access code to reopen this chat later.</p>';
    }
  } else if (isAdmin) {
    if (footer) footer.hidden = true;
    if (projectNameInput) projectNameInput.hidden = true;
    if (contactInput) contactInput.hidden = true;
    loadMessages()
      .then(startPolling)
      .catch((err) => showError(err.message || 'Could not load chat'));
  } else if (!accessCode) {
    showError('Missing access code on this device. Open /chats and paste your saved code.');
  } else {
    setAccessCode(accessCode);
    setProjectTitle(getDiscussProjectName(discussionId) || 'Project chat');
    if (projectNameInput) projectNameInput.hidden = true;
    if (contactInput) contactInput.hidden = true;
    loadMessages()
      .then(startPolling)
      .catch((err) => showError(err.message || 'Could not load chat'));
  }
}

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
