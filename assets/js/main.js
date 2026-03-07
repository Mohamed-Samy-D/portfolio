/* ============================================================
   MAIN.JS — Personal Hacker Website
   All data, rendering, admin, sidebar, and CRUD logic
   ============================================================ */

'use strict';

/* ---- DEFAULT DATA ---- */
const DEFAULTS = {
  name: 'Moayad',
  tagline: 'breaking systems to build better ones',
  specialty: 'Ethical Hacker & Cybersecurity Researcher',
  bio: "I'm Moayad, a passionate ethical hacker and programmer with a deep interest in cybersecurity, reverse engineering, and exploit development. I believe in understanding systems at their deepest level to build more secure and resilient software.",
  philosophy: "A good hacker doesn't just find vulnerabilities — they understand why they exist and how to prevent them. Security through knowledge, not obscurity.",
  skills: [
    { name: 'Python', level: 90 },
    { name: 'JavaScript', level: 75 },
    { name: 'C / C++', level: 65 },
    { name: 'Linux / Bash', level: 85 },
    { name: 'Network Security', level: 80 },
    { name: 'Web Pentesting', level: 78 },
    { name: 'Reverse Engineering', level: 70 },
    { name: 'Cryptography', level: 62 }
  ],
  hobbies: [
    { icon: '🏁', name: 'CTF Competitions', desc: 'Competing in Capture The Flag challenges to sharpen offensive security skills.' },
    { icon: '🔍', name: 'Bug Bounty', desc: 'Hunting vulnerabilities in real-world systems and responsibly disclosing them.' },
    { icon: '⚙️', name: 'Reverse Engineering', desc: 'Dissecting binaries and malware to understand how software really works.' },
    { icon: '🦠', name: 'Malware Analysis', desc: 'Studying malicious code in isolated environments to understand attacker techniques.' },
    { icon: '💻', name: 'Open Source', desc: 'Contributing to security tools and sharing knowledge with the community.' }
  ],
  books: [
    { title: 'The Art of Intrusion', author: 'Kevin Mitnick', desc: 'Real-world hacking stories that reveal how attackers think and operate.', cover: '', gradient: 'linear-gradient(135deg,#1a1a2e,#16213e)', icon: '📖' },
    { title: 'Hacking: The Art of Exploitation', author: 'Jon Erickson', desc: 'Deep dive into exploit development, buffer overflows, and shellcode.', cover: '', gradient: 'linear-gradient(135deg,#0f3460,#533483)', icon: '💣' },
    { title: 'Ghost in the Wires', author: 'Kevin Mitnick', desc: "The world's most wanted hacker tells his own story — thrilling and real.", cover: '', gradient: 'linear-gradient(135deg,#1a0533,#6a0572)', icon: '👤' },
    { title: 'Black Hat Python', author: 'Justin Seitz', desc: 'Build offensive security tools using Python for real pentesting scenarios.', cover: '', gradient: 'linear-gradient(135deg,#0a0a0f,#1a1a2e)', icon: '🐍' },
    { title: 'The Web App Hacker\'s Handbook', author: 'Stuttard & Pinto', desc: 'The definitive guide to finding and exploiting web application flaws.', cover: '', gradient: 'linear-gradient(135deg,#003d00,#006600)', icon: '🌐' },
    { title: 'Social Engineering', author: 'Christopher Hadnagy', desc: 'Mastering the art of human hacking — the most overlooked attack vector.', cover: '', gradient: 'linear-gradient(135deg,#3a0000,#7a0000)', icon: '🧠' }
  ],
  love: {
    visible: true,
    image: 'assets/imgs/love1.jpg',
    message: "Behind every line of code, there's a feeling that makes it worth writing. You are my greatest bug fix — the one who made everything make sense. In a world of chaos and exploits, you're my safe harbor."
  },
  social: [
    { platform: 'GitHub', handle: 'DeathSimsim', url: 'https://github.com/DeathSimsim', icon: '🐙', color: '#24292e', bg: '#1a1a1a' },
    { platform: 'LinkedIn', handle: 'Mohamed Samy', url: 'https://www.linkedin.com/in/mohamed-samy-4293133a2', icon: '💼', color: '#0077b5', bg: '#003352' },
    { platform: 'Facebook', handle: 'MOsiMsiMM', url: 'https://www.facebook.com/MOsiMsiMM', icon: '👥', color: '#1877f2', bg: '#0d2a5c' },
    { platform: 'Discord', handle: 'Moayad', url: 'https://discord.com/users/954112537115369502', icon: '🎮', color: '#5865f2', bg: '#1a1c3a' }
  ]
};

const ADMIN_PASS = 'death2111';
const LS_KEY = 'hack_site_data';

/* ---- STATE ---- */
let state = loadState();
let adminUnlocked = false;

/* ---- LOAD / SAVE ---- */
function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { }
  return JSON.parse(JSON.stringify(DEFAULTS));
}

function saveState() {
  localStorage.setItem(LS_KEY, JSON.stringify(state));
}

/* ============================================================
   RENDER FUNCTIONS
   ============================================================ */

function applyState() {
  /* Profile */
  setText('site-name', state.name);
  setText('site-tagline', state.tagline);
  setText('about-name', state.name);
  setText('about-specialty', state.specialty);
  setText('about-bio', state.bio);
  setText('about-philosophy', state.philosophy);
  setText('footer-name', state.name);
  setText('footer-year', new Date().getFullYear());
  /* Sidebar preview */
  setText('sb-name-display', state.name);
  setText('sb-spec-display', state.specialty);

  renderSkills();
  renderHobbies();
  renderBooks();

  /* Love */
  const loveSection = document.getElementById('love');
  if (loveSection) loveSection.style.display = state.love.visible ? '' : 'none';
  setImg('love-main-img', state.love.image);
  setText('love-message', state.love.message);

  renderSocial();
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function setImg(id, src) {
  const el = document.getElementById(id);
  if (el && src) el.src = src;
}

/* SKILLS */
function renderSkills() {
  const list = document.getElementById('skills-list');
  if (!list) return;
  list.innerHTML = state.skills.map(s => `
    <div class="skill-item">
      <div class="skill-header">
        <span class="skill-name">${esc(s.name)}</span>
        <span class="skill-pct">${s.level}%</span>
      </div>
      <div class="skill-bar"><div class="skill-fill" data-level="${s.level}"></div></div>
    </div>`).join('');
  /* animate bars */
  requestAnimationFrame(() => {
    list.querySelectorAll('.skill-fill').forEach(fill => {
      fill.style.width = fill.dataset.level + '%';
    });
  });
}

/* HOBBIES */
function renderHobbies() {
  const grid = document.getElementById('hobbies-list');
  if (!grid) return;
  grid.innerHTML = state.hobbies.map(h => `
    <div class="hobby-card">
      <span class="hobby-icon">${esc(h.icon)}</span>
      <div class="hobby-name">${esc(h.name)}</div>
      <div class="hobby-desc">${esc(h.desc)}</div>
    </div>`).join('');
}

/* BOOKS */
function renderBooks() {
  const grid = document.getElementById('books-grid');
  if (!grid) return;
  grid.innerHTML = state.books.map((b, i) => {
    const coverHtml = b.cover
      ? `<img src="${b.cover}" alt="${esc(b.title)}" class="book-cover">`
      : `<div class="book-cover-placeholder" style="background:${b.gradient || 'linear-gradient(135deg,#111,#222)'}">
           <span class="book-icon">${b.icon || '📚'}</span>
           <span class="book-cover-title">${esc(b.title)}</span>
         </div>`;
    return `
      <div class="book-card" data-book-idx="${i}">
        <div class="book-cover-wrap">${coverHtml}</div>
        <div class="book-info">
          <div class="book-title">${esc(b.title)}</div>
          <div class="book-author">${esc(b.author)}</div>
          <div class="book-desc">${esc(b.desc)}</div>
        </div>
      </div>`;
  }).join('');
}

/* SOCIAL */
function renderSocial() {
  const grid = document.getElementById('social-grid');
  if (!grid) return;
  grid.innerHTML = state.social.map(s => `
    <a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer" class="social-card">
      <div class="social-icon" style="background:${s.bg || '#111'}">${s.icon || '🔗'}</div>
      <div class="social-info">
        <div class="social-platform">${esc(s.platform)}</div>
        <div class="social-handle">@${esc(s.handle || '')}</div>
      </div>
    </a>`).join('');
}

/* ============================================================
   SIDEBAR EDITOR RENDERS
   ============================================================ */

function renderSbSkills() {
  const el = document.getElementById('sb-skills-list');
  if (!el) return;
  el.innerHTML = state.skills.map((s, i) => `
    <div class="sb-skill-row">
      <input type="text" placeholder="Skill name" value="${esc(s.name)}" data-skill="${i}" data-field="name">
      <input type="number" min="0" max="100" value="${s.level}" data-skill="${i}" data-field="level" placeholder="%">
      <button class="sb-del-btn" data-del-skill="${i}" title="Delete">×</button>
    </div>`).join('');
}

function renderSbHobbies() {
  const el = document.getElementById('sb-hobbies-list');
  if (!el) return;
  el.innerHTML = state.hobbies.map((h, i) => `
    <div class="sb-hobby-row">
      <div class="sb-hobby-top">
        <input type="text" placeholder="🎯" value="${esc(h.icon)}" data-hobby="${i}" data-field="icon" maxlength="4">
        <input type="text" placeholder="Name" value="${esc(h.name)}" data-hobby="${i}" data-field="name">
        <button class="sb-del-btn" data-del-hobby="${i}" title="Delete">×</button>
      </div>
      <input class="hobby-desc-input" type="text" placeholder="Short description" value="${esc(h.desc)}" data-hobby="${i}" data-field="desc">
    </div>`).join('');
}

function renderSbBooks() {
  const el = document.getElementById('sb-books-list');
  if (!el) return;
  el.innerHTML = state.books.map((b, i) => `
    <div class="sb-book-row" data-book="${i}">
      <input type="text" placeholder="Book title" value="${esc(b.title)}" data-book="${i}" data-field="title">
      <input type="text" placeholder="Author" value="${esc(b.author)}" data-book="${i}" data-field="author">
      <textarea rows="2" placeholder="Description" data-book="${i}" data-field="desc">${esc(b.desc)}</textarea>
      <div class="sb-book-actions">
        <input type="file" accept="image/*" id="book-cover-${i}" style="display:none" data-book="${i}">
        <label for="book-cover-${i}" class="btn-add" style="flex:1;display:block;text-align:center;">📷 Cover</label>
        <button class="sb-del-btn" data-del-book="${i}" title="Remove">×</button>
      </div>
    </div>`).join('');
}

function renderSbSocial() {
  const el = document.getElementById('sb-social-list');
  if (!el) return;
  const platforms = ['GitHub', 'LinkedIn', 'Twitter/X', 'Facebook', 'Instagram', 'Discord', 'YouTube', 'TikTok', 'Telegram', 'Other'];
  el.innerHTML = state.social.map((s, i) => `
    <div class="sb-social-row">
      <div class="sb-social-row-top">
        <input type="text" placeholder="Icon emoji" value="${esc(s.icon)}" data-social="${i}" data-field="icon" maxlength="4">
        <select data-social="${i}" data-field="platform">
          ${platforms.map(p => `<option value="${p}" ${p === s.platform ? 'selected' : ''}>${p}</option>`).join('')}
        </select>
        <button class="sb-del-btn" data-del-social="${i}">×</button>
      </div>
      <input type="text" placeholder="Display handle" value="${esc(s.handle || '')}" data-social="${i}" data-field="handle">
      <input type="url" placeholder="https://..." value="${esc(s.url)}" data-social="${i}" data-field="url" style="margin-top:6px">
    </div>`).join('');
}

function populateSbProfile() {
  setVal('edit-name', state.name);
  setVal('edit-tagline', state.tagline);
  setVal('edit-specialty', state.specialty);
  setVal('edit-bio', state.bio);
  setVal('edit-philosophy', state.philosophy);
  setChecked('love-visible', state.love.visible);
  setVal('edit-love-msg', state.love.message);
  const lp = document.getElementById('sb-love-preview');
  if (lp) lp.src = state.love.image || 'assets/imgs/love1.jpg';
}

function setVal(id, v) { const e = document.getElementById(id); if (e) e.value = v || ''; }
function setChecked(id, v) { const e = document.getElementById(id); if (e) e.checked = !!v; }
function esc(s) { return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  /* Also trigger skill bar animation on scroll */
  const skillObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.skill-fill').forEach(f => { f.style.width = f.dataset.level + '%'; });
      }
    });
  }, { threshold: 0.1 });
  const skillSec = document.getElementById('skills');
  if (skillSec) skillObs.observe(skillSec);
}

/* ============================================================
   NAVBAR
   ============================================================ */
function initNavbar() {
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }
}

/* ============================================================
   ADMIN MODAL
   ============================================================ */
function initAdminModal() {
  const avatarBtn = document.getElementById('avatar-btn');
  const modal = document.getElementById('admin-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const form = document.getElementById('admin-form');
  const errEl = document.getElementById('admin-error');

  if (!avatarBtn || !modal) return;

  avatarBtn.addEventListener('click', () => {
    if (adminUnlocked) { openSidebar(); return; }
    modal.classList.add('active');
    setTimeout(() => document.getElementById('admin-pass')?.focus(), 100);
  });

  closeBtn?.addEventListener('click', () => modal.classList.remove('active'));
  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('active'); });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const pass = document.getElementById('admin-pass').value;
    if (pass === ADMIN_PASS) {
      adminUnlocked = true;
      modal.classList.remove('active');
      document.getElementById('admin-pass').value = '';
      errEl.textContent = '';
      openSidebar();
    } else {
      errEl.textContent = '❌ Wrong password. Try again.';
      document.getElementById('admin-pass').value = '';
    }
  });
}

/* ============================================================
   SIDEBAR
   ============================================================ */
function openSidebar() {
  populateSbProfile();
  renderSbSkills();
  renderSbHobbies();
  renderSbBooks();
  renderSbSocial();
  document.getElementById('sidebar').classList.add('active');
  document.getElementById('sidebar-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('active');
  document.getElementById('sidebar-overlay').classList.remove('active');
  document.body.style.overflow = '';
}

function initSidebar() {
  document.getElementById('sidebar-close')?.addEventListener('click', closeSidebar);
  document.getElementById('sidebar-overlay')?.addEventListener('click', closeSidebar);

  /* Tabs */
  document.querySelectorAll('.sb-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.sb-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.sb-tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById('tab-' + tab.dataset.tab);
      if (target) target.classList.add('active');
    });
  });

  /* ---- Profile tab events ---- */
  document.getElementById('save-profile-btn')?.addEventListener('click', () => {
    state.name = document.getElementById('edit-name').value.trim() || state.name;
    state.tagline = document.getElementById('edit-tagline').value.trim() || state.tagline;
    state.specialty = document.getElementById('edit-specialty').value.trim() || state.specialty;
    state.bio = document.getElementById('edit-bio').value.trim() || state.bio;
    state.philosophy = document.getElementById('edit-philosophy').value.trim() || state.philosophy;
    saveState();
    applyState();
    flashSave('Profile saved! ✅');
  });

  /* Skills live edit + delete */
  document.getElementById('sb-skills-list')?.addEventListener('input', e => {
    const { skill, field } = e.target.dataset;
    if (skill !== undefined) {
      state.skills[+skill][field] = field === 'level' ? Math.min(100, Math.max(0, +e.target.value)) : e.target.value;
    }
  });
  document.getElementById('sb-skills-list')?.addEventListener('click', e => {
    const idx = e.target.dataset.delSkill;
    if (idx !== undefined) { state.skills.splice(+idx, 1); renderSbSkills(); }
  });
  document.getElementById('add-skill-btn')?.addEventListener('click', () => {
    state.skills.push({ name: 'New Skill', level: 50 });
    renderSbSkills();
  });

  /* Hobbies live edit + delete */
  document.getElementById('sb-hobbies-list')?.addEventListener('input', e => {
    const { hobby, field } = e.target.dataset;
    if (hobby !== undefined) state.hobbies[+hobby][field] = e.target.value;
  });
  document.getElementById('sb-hobbies-list')?.addEventListener('click', e => {
    const idx = e.target.dataset.delHobby;
    if (idx !== undefined) { state.hobbies.splice(+idx, 1); renderSbHobbies(); }
  });
  document.getElementById('add-hobby-btn')?.addEventListener('click', () => {
    state.hobbies.push({ icon: '⭐', name: 'New Hobby', desc: 'Describe this hobby...' });
    renderSbHobbies();
  });

  /* ---- Books tab events ---- */
  document.getElementById('sb-books-list')?.addEventListener('input', e => {
    const { book, field } = e.target.dataset;
    if (book !== undefined) state.books[+book][field] = e.target.value;
  });
  document.getElementById('sb-books-list')?.addEventListener('click', e => {
    const idx = e.target.dataset.delBook;
    if (idx !== undefined) { state.books.splice(+idx, 1); renderSbBooks(); saveState(); renderBooks(); flashSave('Book deleted ✅'); }
  });
  document.getElementById('sb-books-list')?.addEventListener('change', e => {
    const bookIdx = e.target.dataset.book;
    if (bookIdx !== undefined && e.target.type === 'file' && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = ev => {
        state.books[+bookIdx].cover = ev.target.result;
        saveState(); renderBooks(); renderSbBooks();
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  });
  document.getElementById('add-book-btn')?.addEventListener('click', () => {
    state.books.push({ title: 'New Book', author: 'Author', desc: 'Description...', cover: '', gradient: 'linear-gradient(135deg,#1a1a2e,#0f3460)', icon: '📚' });
    renderSbBooks(); saveState(); renderBooks();
  });

  /* ---- Love tab events ---- */
  document.getElementById('love-img-input')?.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      state.love.image = ev.target.result;
      const prev = document.getElementById('sb-love-preview');
      if (prev) prev.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
  document.getElementById('save-love-btn')?.addEventListener('click', () => {
    state.love.visible = document.getElementById('love-visible').checked;
    state.love.message = document.getElementById('edit-love-msg').value.trim() || state.love.message;
    saveState();
    const loveSection = document.getElementById('love');
    if (loveSection) loveSection.style.display = state.love.visible ? '' : 'none';
    setText('love-message', state.love.message);
    setImg('love-main-img', state.love.image);
    flashSave('Love section saved! ❤️');
  });

  /* ---- Social tab events ---- */
  document.getElementById('sb-social-list')?.addEventListener('input', e => {
    const { social, field } = e.target.dataset;
    if (social !== undefined) state.social[+social][field] = e.target.value;
  });
  document.getElementById('sb-social-list')?.addEventListener('change', e => {
    const { social, field } = e.target.dataset;
    if (social !== undefined) state.social[+social][field] = e.target.value;
  });
  document.getElementById('sb-social-list')?.addEventListener('click', e => {
    const idx = e.target.dataset.delSocial;
    if (idx !== undefined) { state.social.splice(+idx, 1); renderSbSocial(); renderSocial(); saveState(); }
  });
  document.getElementById('add-social-btn')?.addEventListener('click', () => {
    state.social.push({ platform: 'Other', handle: '', url: 'https://', icon: '🔗', bg: '#111' });
    renderSbSocial();
  });
  document.getElementById('save-social-btn')?.addEventListener('click', () => {
    saveState(); renderSocial(); flashSave('Social links saved! ✅');
  });
}

/* Flash save message */
function flashSave(msg) {
  let el = document.getElementById('flash-save');
  if (!el) {
    el = document.createElement('div');
    el.id = 'flash-save';
    el.style.cssText = 'position:fixed;bottom:100px;right:26px;background:#00ff88;color:#0a0a0f;padding:10px 20px;border-radius:8px;font-weight:600;font-size:0.85rem;z-index:2000;opacity:0;transition:opacity 0.3s';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.opacity = '1';
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.style.opacity = '0', 2500);
}

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  applyState();
  initScrollReveal();
  initNavbar();
  initAdminModal();
  initSidebar();
  initSmoothScroll();

  /* Re-trigger skill bars after page data applied */
  setTimeout(() => {
    document.querySelectorAll('.skill-fill').forEach(f => { f.style.width = f.dataset.level + '%'; });
  }, 400);
});
