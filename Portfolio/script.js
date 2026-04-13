const progress = document.getElementById('progress');
const nav = document.getElementById('nav');
const mobileMenu = document.getElementById('mobileMenu');
const hamBtn = document.getElementById('hamBtn');

let activeModalId = null;
let lastModalTrigger = null;

window.addEventListener('scroll', () => {
  const sc = document.documentElement;
  const scrollableHeight = sc.scrollHeight - sc.clientHeight;
  const progressWidth = scrollableHeight > 0 ? (sc.scrollTop / scrollableHeight) * 100 : 0;

  if (progress) progress.style.width = `${progressWidth}%`;
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
});

if (hamBtn && mobileMenu) {
  hamBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    hamBtn.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');
  });

  document.querySelectorAll('.mm-link').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamBtn.setAttribute('aria-expanded', 'false');
      hamBtn.setAttribute('aria-label', 'Menü öffnen');
    });
  });
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    entry.target.classList.add('on');
    const siblings = [
      ...entry.target.parentElement.querySelectorAll('.reveal:not(.on), .reveal-l:not(.on)'),
    ];

    siblings.forEach((sibling, index) => {
      setTimeout(() => sibling.classList.add('on'), index * 80);
    });
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal, .reveal-l').forEach((element) => {
  revealObserver.observe(element);
});

function setAccordionState(item, isOpen) {
  const header = item.querySelector('[data-edu-toggle]');
  const body = item.querySelector('.edu-body');

  item.classList.toggle('open', isOpen);
  header?.setAttribute('aria-expanded', String(isOpen));

  if (!body) return;
  body.style.maxHeight = isOpen ? `${body.scrollHeight}px` : '0px';
}

document.querySelectorAll('.edu-item').forEach((item) => {
  const header = item.querySelector('[data-edu-toggle]');

  if (!header) return;

  setAccordionState(item, false);

  header.addEventListener('click', () => {
    const wasOpen = item.classList.contains('open');

    document.querySelectorAll('.edu-item').forEach((eduItem) => {
      setAccordionState(eduItem, false);
    });

    if (!wasOpen) setAccordionState(item, true);
  });
});

window.addEventListener('resize', () => {
  if (!activeModalId) {
    document.querySelectorAll('.edu-item.open').forEach((item) => {
      const body = item.querySelector('.edu-body');
      if (body) body.style.maxHeight = `${body.scrollHeight}px`;
    });
  }
});

function getModalParts(id) {
  return {
    backdrop: document.getElementById(`modalBg${id}`),
    dialog: document.getElementById(`modal${id}`),
  };
}

function openModal(id, trigger = null) {
  const modalName = id.charAt(0).toUpperCase() + id.slice(1);
  const { backdrop, dialog } = getModalParts(modalName);

  if (!backdrop || !dialog) return;

  backdrop.classList.add('open');
  dialog.classList.add('open');
  dialog.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  activeModalId = modalName;
  lastModalTrigger = trigger;

  dialog.querySelector('.modal-close')?.focus();
}

function closeModal(id = activeModalId) {
  if (!id) return;

  const modalName = id.charAt(0).toUpperCase() + id.slice(1);
  const { backdrop, dialog } = getModalParts(modalName);

  if (!backdrop || !dialog) return;

  backdrop.classList.remove('open');
  dialog.classList.remove('open');
  dialog.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  activeModalId = null;
  lastModalTrigger?.focus();
  lastModalTrigger = null;
}

document.querySelectorAll('[data-modal-target]').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    openModal(trigger.dataset.modalTarget, trigger);
  });
});

document.querySelectorAll('[data-modal-close]').forEach((closer) => {
  closer.addEventListener('click', () => {
    closeModal(closer.dataset.modalClose);
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal();
});
