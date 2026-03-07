/* =====================================================
   LOVE.JS — Name Verification & Love Page Logic
   ===================================================== */

'use strict';

/* ---- SECRET CONFIG ----
   Name stored as reversed Base64 chunks to obscure from casual inspect.
   "Hager" → Base64: "SGFnZXI="
   Password: "جوجو" → obfuscated below
   ---------------------------------------------------- */
function _getSecretName() {
    // Build the name secret in pieces — harder to grep
    const p = ['S', 'G', 'F', 'n', 'Z', 'X', 'I', '='];
    return atob(p.join(''));
}

function _getSecretPass() {
    // Build the password secret in pieces: "jojo" -> "am9qbw=="
    const p = ['a', 'm', '9', 'q', 'b', 'w', '=', '='];
    return atob(p.join(''));
}

function _normalize(s) {
    return String(s || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '');
}

function _checkName(input) {
    const secret = _getSecretName();
    const norm = _normalize(input);
    const normSecret = _normalize(secret);
    return norm === normSecret;
}

function _checkPass(input) {
    const secret = _getSecretPass();
    // exact match for the password "jojo", though we'll normalize space just in case
    return input.trim() === secret.trim();
}

/* ---- DOM HELPERS ---- */
const $ = id => document.getElementById(id);
function setText(id, val) { const e = $(id); if (e) e.textContent = val; }
function show(el) { el && el.classList.remove('hidden'); }
function hide(el) { el && el.classList.add('hidden'); }

/* ---- FLOATING HEARTS CANVAS ---- */
function initHeartsCanvas() {
    const canvas = document.getElementById('hearts-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const HEARTS = ['❤', '♥', '💕'];
    const particles = [];

    for (let i = 0; i < 28; i++) {
        particles.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight + window.innerHeight,
            size: Math.random() * 16 + 8,
            speed: Math.random() * 0.6 + 0.3,
            opacity: Math.random() * 0.4 + 0.1,
            drift: (Math.random() - 0.5) * 0.5,
            symbol: HEARTS[Math.floor(Math.random() * HEARTS.length)],
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.02
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.font = `${p.size}px serif`;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.fillStyle = `hsl(${330 + Math.random() * 30}, 80%, 70%)`;
            ctx.fillText(p.symbol, 0, 0);
            ctx.restore();

            p.y -= p.speed;
            p.x += p.drift;
            p.rotation += p.rotSpeed;

            if (p.y < -40) {
                p.y = canvas.height + 40;
                p.x = Math.random() * canvas.width;
                p.opacity = Math.random() * 0.4 + 0.1;
            }
        });
        requestAnimationFrame(draw);
    }
    draw();
}

/* ---- NAME GATE LOGIC ---- */
function initGate() {
    const gate = $('name-gate');
    const input = $('name-input');
    const passInput = $('pass-input');
    const btn = $('gate-btn');
    const feedback = $('gate-feedback');

    if (!gate || !input || !passInput || !btn) return;

    function attempt() {
        const val = input.value;
        const passVal = passInput.value;

        if (!val.trim()) {
            feedback.textContent = '// Please enter her name first…';
            feedback.className = 'gate-feedback error';
            input.classList.add('shake');
            setTimeout(() => input.classList.remove('shake'), 600);
            return;
        }

        if (!passVal.trim()) {
            feedback.textContent = '// Please enter the password first…';
            feedback.className = 'gate-feedback error';
            passInput.classList.add('shake');
            setTimeout(() => passInput.classList.remove('shake'), 600);
            return;
        }

        const isNameCorrect = _checkName(val);
        const isPassCorrect = _checkPass(passVal);

        if (isNameCorrect && isPassCorrect) {
            // ✅ CORRECT NAME AND PASSWORD
            feedback.textContent = '// ✅ Welcome…';
            feedback.className = 'gate-feedback success';
            btn.disabled = true;

            setTimeout(() => {
                hide(gate);
                showLoveContent(val.trim());
            }, 900);
        } else if (isNameCorrect && !isPassCorrect) {
            // ❌ CORRECT NAME BUT WRONG PASSWORD
            feedback.textContent = '// Incorrect password… this place is for "jojo" only';
            feedback.className = 'gate-feedback error';
            passInput.classList.add('shake');
            setTimeout(() => passInput.classList.remove('shake'), 600);
        } else {
            // ❌ WRONG NAME
            feedback.textContent = '// This page is not for you… but hello 💙';
            feedback.className = 'gate-feedback error';
            input.classList.add('shake');
            passInput.classList.add('shake');
            setTimeout(() => {
                input.classList.remove('shake');
                passInput.classList.remove('shake');
            }, 600);

            setTimeout(() => {
                hide(gate);
                showFriendContent(val.trim());
            }, 1200);
        }
    }

    btn.addEventListener('click', attempt);
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') passInput.focus();
        // Clear error on typing
        feedback.textContent = '';
    });
    passInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') attempt();
        // Clear error on typing
        feedback.textContent = '';
    });

    // Focus input on load
    setTimeout(() => input.focus(), 500);
}

/* ---- SHOW FRIENDSHIP CONTENT ---- */
function showFriendContent(name) {
    const el = $('friend-content');
    show(el);
    const nameDisplay = $('friend-name-display');
    if (nameDisplay && name) {
        nameDisplay.textContent = `// Hello ${name}`;
    }
}

/* ---- ADMIN SIDBAR & STORAGE ---- */
const LS_KEY = 'hack_site_data';
const ADMIN_PASS = 'death2111';
let adminUnlocked = false;

function loadState() {
    try {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) return JSON.parse(raw);
    } catch (e) { }
    return null;
}

function saveState(state) {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
}

function applyLoveState() {
    const state = loadState();
    if (state && state.love) {
        // Apply to the page
        const mainImg = document.querySelector('.lv-photo');
        if (mainImg && state.love.image) mainImg.src = state.love.image;

        const mainMsg = document.getElementById('lv-special-text');
        if (mainMsg && state.love.message) {
            // Keep the greeting / formatting if possible, or just overwrite the text
            // We'll replace the text content, but ideally preserve the name span if we had a dedicated container.
            // For now, let's just update the inner text while keeping the name span if it exists.
            const nameEl = document.getElementById('lv-special-name');
            const name = nameEl ? nameEl.textContent : '';
            mainMsg.innerHTML = `Dear <span class="lv-special-name" id="lv-special-name">${name}</span>,<br><br>${state.love.message.replace(/\n/g, '<br>')}`;
        }
    }
}

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

function openSidebar() {
    // Populate the form fields with current state
    const state = loadState() || { love: { visible: true, image: 'assets/imgs/my_girl.jpg', message: '' } };
    const loveVisible = document.getElementById('love-visible');
    const loveMsg = document.getElementById('edit-love-msg');
    const lovePrev = document.getElementById('sb-love-preview');

    if (loveVisible) loveVisible.checked = state.love.visible;
    if (loveMsg && state.love.message) loveMsg.value = state.love.message;
    if (lovePrev && state.love.image) lovePrev.src = state.love.image;

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

    // Save Logic
    document.getElementById('save-love-btn')?.addEventListener('click', () => {
        const state = loadState() || { love: {} };
        if (!state.love) state.love = {};

        const loveVisible = document.getElementById('love-visible');
        const loveMsg = document.getElementById('edit-love-msg');
        const lovePrev = document.getElementById('sb-love-preview');

        if (loveVisible) state.love.visible = loveVisible.checked;
        if (loveMsg) state.love.message = loveMsg.value;
        if (lovePrev) state.love.image = lovePrev.src;

        saveState(state);
        applyLoveState();

        const btn = document.getElementById('save-love-btn');
        btn.textContent = '✅ Saved!';
        setTimeout(() => btn.textContent = '💾 Save Love', 2000);
    });

    // Image Upload Logic
    document.getElementById('love-img-input')?.addEventListener('change', e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
            const prev = document.getElementById('sb-love-preview');
            if (prev) prev.src = ev.target.result;
        };
        reader.readAsDataURL(file);
    });
}

/* ---- SHOW LOVE CONTENT ---- */
function showLoveContent(name) {
    const el = $('love-content');
    show(el);

    // Show avatar button so Admin can edit
    const avatar = $('avatar-btn');
    if (avatar) avatar.style.display = 'block';

    // Populate name
    setText('lv-name-reveal', name);
    setText('lv-special-name', name);
    setText('lv-footer-name', name);

    applyLoveState();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Trigger message card animations
    document.querySelectorAll('.lv-msg-card').forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 200 + i * 150);
    });

    // Intersection observer for scroll-in animations
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.style.opacity = '1';
                e.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.lv-msg-card, .lv-special').forEach(el => {
        obs.observe(el);
    });
}
/* ---- CURSOR HEART ANIMATION ---- */
function initCursorHearts() {
    let lastSpawn = 0;
    const spawnDelay = 150; // Adjust for heart density

    function spawnHeart(e) {
        const now = Date.now();
        if (now - lastSpawn < spawnDelay) return;
        lastSpawn = now;

        const heart = document.createElement('div');
        heart.className = 'cursor-heart';
        // Pick a random symbol
        heart.textContent = ['❤️', '💕', '💖', '✨'][Math.floor(Math.random() * 4)];
        heart.style.left = e.clientX + 'px';
        heart.style.top = e.clientY + 'px';
        document.body.appendChild(heart);

        setTimeout(() => heart.remove(), 1000);
    }

    const wraps = document.querySelectorAll('.lv-photo-gallery .lv-photo-wrap, .lv-photo-section .lv-photo-wrap');
    wraps.forEach(wrap => {
        wrap.addEventListener('mousemove', spawnHeart);
    });
}

/* ---- INIT ---- */
document.addEventListener('DOMContentLoaded', () => {
    initHeartsCanvas();
    initGate();
    initAdminModal();
    initSidebar();
    initCursorHearts();
});
