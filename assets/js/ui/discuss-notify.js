import {
  API_BASE,
  getDiscussSeen,
  getSavedDiscussCodes,
  normalizeSavedDiscuss,
} from '../config.js';

const btn = document.querySelector('[data-hire-mode="discuss"]');

async function peekUnread() {
  const saved = getSavedDiscussCodes();
  const chats = Object.entries(saved)
    .map(([id, raw]) => {
      const { accessCode } = normalizeSavedDiscuss(raw);
      return { id, accessCode };
    })
    .filter((row) => row.id && row.accessCode)
    .slice(0, 20);

  if (!chats.length || !btn) return;

  try {
    const res = await fetch(`${API_BASE}/api/discussions/peek`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chats }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return;

    const hasUnread = (data.chats || []).some((row) => {
      if (!row?.lastAdminAt) return false;
      const seen = getDiscussSeen(row.id);
      if (!seen) return true;
      return new Date(row.lastAdminAt).getTime() > new Date(seen).getTime();
    });

    btn.classList.toggle('has-unread', hasUnread);
    btn.setAttribute(
      'aria-label',
      hasUnread ? 'Discuss Your Project — new reply' : 'Discuss Your Project',
    );
  } catch {
    /* ignore offline / CORS during local static preview */
  }
}

peekUnread();
