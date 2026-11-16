import { API_BASE } from '../config.js';

const modal = document.getElementById('hire-modal');
const form = document.getElementById('hire-form');
const errorEl = document.getElementById('hire-form-error');
const titleEl = document.getElementById('hire-modal-title');
const submitBtn = form?.querySelector('button[type="submit"]');

function openModal() {
  if (titleEl) titleEl.textContent = 'Hire me';
  modal.hidden = false;
  document.body.classList.add('hire-modal-open');
  form?.querySelector('select[name="projectType"]')?.focus();
}

function closeModal() {
  modal.hidden = true;
  document.body.classList.remove('hire-modal-open');
  hideError();
}

function hideError() {
  if (!errorEl) return;
  errorEl.hidden = true;
  errorEl.textContent = '';
}

function showError(message) {
  if (!errorEl) return;
  errorEl.hidden = false;
  errorEl.textContent = message;
}

function getFormData() {
  const data = new FormData(form);
  return {
    projectType: String(data.get('projectType') || '').trim(),
    telegram: String(data.get('telegram') || '').trim(),
    whatsapp: String(data.get('whatsapp') || '').trim(),
    email: String(data.get('email') || '').trim(),
    description: String(data.get('description') || '').trim(),
    budget: Number(data.get('budget') || 0),
    website: String(data.get('website') || ''),
  };
}

function validate(values) {
  if (!values.projectType) return 'Please choose a project type.';
  if (!values.description) return 'Please add a short description.';
  if (!values.telegram && !values.whatsapp && !values.email) {
    return 'Add at least one contact: Telegram, WhatsApp, or email.';
  }
  if (values.email) {
    const emailInput = form?.querySelector('input[name="email"]');
    if (emailInput && !emailInput.checkValidity()) {
      return 'Please enter a valid email.';
    }
  }
  if (values.budget < 0) {
    return 'Budget cannot be negative.';
  }
  return '';
}

async function submitHire(values) {
  const res = await fetch(`${API_BASE}/api/hire`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

document.querySelectorAll('[data-hire-mode]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const mode = btn.dataset.hireMode || 'hire';
    if (mode === 'discuss') {
      window.location.href = './chats.html';
      return;
    }
    openModal();
  });
});

modal?.querySelectorAll('[data-hire-close]').forEach((el) => {
  el.addEventListener('click', closeModal);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal && !modal.hidden) closeModal();
});

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideError();
  const values = getFormData();
  const error = validate(values);
  if (error) {
    showError(error);
    return;
  }

  const prev = submitBtn?.textContent;
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
  }

  try {
    await submitHire(values);
    closeModal();
    form.reset();
    alert('Thanks — I got your request and will reply soon.');
  } catch (err) {
    showError(err.message || 'Could not send. Try again later.');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = prev || 'Send request';
    }
  }
});
