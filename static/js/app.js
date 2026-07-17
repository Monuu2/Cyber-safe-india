// ─── DATA STORE ───────────────────────────────────────────────────────────────
const STORAGE_KEY = 'cybersafe_posts_v1';

const DEFAULT_POSTS = [{
    id: 'p1',
    title: 'Massive UPI AutoPay Scam Drains Accounts Across India',
    category: 'alert',
    summary: 'Victims unknowingly authorize recurring payments disguised as OTT or utility services.',
    content: 'A new wave of UPI AutoPay fraud is targeting users through fake subscription approvals. Scammers create counterfeit links mimicking OTT platforms and utility providers. Once approved, silent deductions occur over weeks before victims notice. Always verify mandate sources in your BHIM/UPI app settings and revoke unknown mandates immediately. Report to 1930 within the golden hour.',
    author: 'CyberSafe Team',
    emoji: '💸',
    featured: true,
    date: '2026-04-10'
}, {
    id: 'p2',
    title: 'Deepfake Video Calls Used in Corporate Fraud',
    category: 'news',
    summary: 'AI-generated video calls mimic CFOs and CEOs to authorize fraudulent fund transfers.',
    content: 'Several Indian corporations have reported losses after attackers used AI deepfake technology to impersonate senior executives on video calls. Employees were tricked into transferring funds to fraudulent accounts. Experts recommend verbal code-word verification for all financial transactions, regardless of video confirmation.',
    author: 'Tech Desk',
    emoji: '🤖',
    featured: false,
    date: '2026-04-09'
}, {
    id: 'p3',
    title: 'Fake Police Arrest Scam Spreading via WhatsApp',
    category: 'alert',
    summary: 'Scammers pose as officers threatening immediate arrest to extort payments.',
    content: 'A new variant of the "Digital Arrest" scam has emerged across major Indian cities. Fraudsters call victims claiming to be CBI or local police officers, threatening arrest over fabricated cases. They demand urgent payment to "settle" the matter. Remember: No real officer will demand payment over a phone or video call. Hang up and call 1930 immediately.',
    author: 'CyberSafe Team',
    emoji: '👮',
    featured: false,
    date: '2026-04-08'
}, {
    id: 'p4',
    title: 'How to Disable UPI AutoPay Mandates',
    category: 'guide',
    summary: 'Step-by-step guide to check and revoke unknown UPI mandates in minutes.',
    content: 'Open your UPI app (Google Pay, PhonePe, or BHIM). Navigate to Settings → Manage Mandates or AutoPay. Review all active mandates. Pause or delete any you do not recognize. Check your bank statement for recurring small deductions. Enable transaction alerts for all amounts.',
    author: 'Security Desk',
    emoji: '🔒',
    featured: false,
    date: '2026-04-07'
}, {
    id: 'p5',
    title: 'Telegram Job Scam Rings Target Indian Youth',
    category: 'alert',
    summary: 'Part-time job offers that trap users in deposit-based task scams.',
    content: 'Fraudsters on Telegram promise easy part-time income through "task-based" work like watching videos or rating products. Victims initially receive small payouts to build trust, then are asked to deposit money to "unlock" higher-paying tasks. Once deposited, the scammers vanish. Never pay money to get paid — this is the defining feature of all such scams.',
    author: 'CyberSafe Team',
    emoji: '📲',
    featured: false,
    date: '2026-04-06'
}, {
    id: 'p6',
    title: 'AI Voice Cloning Used to Defraud Families',
    category: 'news',
    summary: 'Scammers clone relatives\' voices using AI to demand emergency money.',
    content: 'Indian families across Bengaluru and Delhi have reported receiving distress calls where the caller\'s voice sounded exactly like their child or relative. The cloned voice begged for immediate financial help. AI tools can now clone a voice from just a few seconds of audio found on social media. Establish a family verification code word for emergencies.',
    author: 'Investigations',
    emoji: '🗣️',
    featured: false,
    date: '2026-04-05'
}];

const TICKER_ITEMS = [
    '🚨 UPI AutoPay fraud rising — check your mandates',
    '⚠️ Deepfake video scams spreading in corporates',
    '🚔 Fake police arrest calls reported nationwide',
    '💼 Telegram job scams targeting Indian youth',
    '🔐 Never approve unknown UPI mandates',
    '📞 Call 1930 within the golden hour of cyber fraud',
    '🖥️ Screen sharing scams increasing on mobile',
    '🤖 AI voice cloning fraud cases rising in India',
    '🛡️ Enable 2FA on all banking apps immediately',
    '💳 Never share OTP — banks never ask for it',
];

const HERO_STATS = [{
    val: '₹11,333 Cr',
    label: 'Losses in 2025',
    cls: 'red'
}, {
    val: '1.7M+',
    label: 'Complaints (2025)',
    cls: ''
}, {
    val: '1930',
    label: 'Helpline 24×7',
    cls: 'green'
}, {
    val: '8 Hrs',
    label: 'Avg. Resolution',
    cls: ''
},];

// ─── STATE ─────────────────────────────────────────────────────────────────────
let posts = [];
let activeFilter = 'all';

function loadPosts() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            posts = JSON.parse(saved);
        } else {
            posts = [...DEFAULT_POSTS];
            savePosts();
        }
    } catch (e) {
        posts = [...DEFAULT_POSTS];
    }
}

function savePosts() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    } catch (e) { }
}

// ─── TICKER ────────────────────────────────────────────────────────────────────
function buildTicker() {
    const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
    document.getElementById('ticker').innerHTML = doubled
        .map(t => `<span class="ticker-item"><span class="ticker-dot"></span>${t}</span>`)
        .join('');
}

// ─── HERO STATS ────────────────────────────────────────────────────────────────
function buildStats() {
    document.getElementById('stats-row').innerHTML = HERO_STATS
        .map(s => `<div class="stat-box">
      <div class="stat-val ${s.cls}">${s.val}</div>
      <div class="stat-label">${s.label}</div>
    </div>`).join('');
}

// ─── FILTER ────────────────────────────────────────────────────────────────────
function setFilter(f, btn) {
    activeFilter = f;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderBlog();
}

// ─── BLOG RENDER ───────────────────────────────────────────────────────────────
function renderBlog() {
    const q = (document.getElementById('search-input').value || '').toLowerCase();
    let filtered = posts.filter(p => {
        const matchFilter = activeFilter === 'all' || p.category === activeFilter;
        const matchSearch = !q || p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q);
        return matchFilter && matchSearch;
    });

    document.getElementById('post-count').textContent = `${filtered.length} Post${filtered.length !== 1 ? 's' : ''}`;

    const out = document.getElementById('blog-output');
    if (!filtered.length) {
        out.innerHTML = `<div class="empty-state"><div class="es-icon">🔍</div>No posts match your search or filter.</div>`;
        return;
    }

    const featured = filtered.filter(p => p.featured);
    const regular = filtered.filter(p => !p.featured);

    let html = '';

    if (featured.length) {
        html += `<div class="featured-grid">`;
        featured.slice(0, 1).forEach(p => {
            html += buildCard(p, true);
        });
        if (regular.length) html += buildCard(regular[0], false);
        html += `</div>`;
        const rest = regular.slice(1);
        if (rest.length) {
            html += `< div class="card-grid" > `;
            rest.forEach(p => {
                html += buildCard(p, false);
            });
            html += `</div > `;
        }
    } else {
        html += `< div class="card-grid" > `;
        filtered.forEach(p => {
            html += buildCard(p, false);
        });
        html += `</div > `;
    }

    out.innerHTML = html;
}

function buildCard(p, featured) {
    const tagMap = {
        alert: '<span class="tag tag-alert">🚨 Alert</span>',
        guide: '<span class="tag tag-guide">📖 Guide</span>',
        news: '<span class="tag tag-news">📰 News</span>',
    };
    const fDate = formatDate(p.date);
    return `
    < div class="card${featured ? ' featured' : ''}" >
        ${featured ? '<span class="card-badge">FEATURED</span>' : ''}
      <div class="card-img-placeholder">${p.emoji || '🛡'}</div>
      <div class="card-body">
        <div class="card-tags">${tagMap[p.category] || ''}</div>
        <h3>${escHtml(p.title)}</h3>
        <p>${escHtml(p.summary)}</p>
        <div class="card-meta">
          <span>✍ ${escHtml(p.author)}</span>
          <span>📅 ${fDate}</span>
        </div>
      </div>
    </div > `;
}

function formatDate(d) {
    if (!d) return 'Recently';
    try {
        return new Date(d).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    } catch (e) {
        return d;
    }
}

function escHtml(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ─── ADMIN SECURITY ───────────────────────────────────────────────────────────
// SHA-256 hash of the admin password. Default password: CyberSafe@2026
// To change: replace this hash with SHA-256 of your new password.
const ADMIN_PASS_HASH = '2d069c8912dfee4a7b767061dcebe004ca66bbfa94026c0eb7b0f10d2f07f225';

// Security config
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes
const SESSION_MS = 30 * 60 * 1000; // 30-minute session timeout
const SEC_KEY = 'csi_admin_sec';

let sessionTimer = null;

async function sha256(msg) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(msg));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function getSecState() {
    try {
        return JSON.parse(sessionStorage.getItem(SEC_KEY)) || {};
    } catch {
        return {};
    }
}

function setSecState(s) {
    sessionStorage.setItem(SEC_KEY, JSON.stringify(s));
}

function isLockedOut() {
    const s = getSecState();
    if (s.lockUntil && Date.now() < s.lockUntil) return s.lockUntil;
    return false;
}

function isAuthenticated() {
    const s = getSecState();
    return s.auth && s.authExpiry && Date.now() < s.authExpiry;
}

function startSessionTimer() {
    clearTimeout(sessionTimer);
    sessionTimer = setTimeout(() => {
        const s = getSecState();
        delete s.auth;
        delete s.authExpiry;
        setSecState(s);
        if (document.getElementById('admin-overlay').classList.contains('open')) {
            closeAdminPanel();
            showToast('⏱ Session expired. Please log in again.', '#ff3d5a');
        }
    }, SESSION_MS);
}

function openAdmin() {
    if (isAuthenticated()) {
        startSessionTimer();
        document.getElementById('admin-overlay').classList.add('open');
        renderAdminList();
    } else {
        showLoginModal();
    }
}

function closeAdmin() {
    document.getElementById('admin-overlay').classList.remove('open');
}

function closeAdminPanel() {
    document.getElementById('admin-overlay').classList.remove('open');
}

function logout() {
    const s = getSecState();
    delete s.auth;
    delete s.authExpiry;
    setSecState(s);
    clearTimeout(sessionTimer);
    closeAdmin();
    showToast('🔒 Logged out successfully.');
}

// ─── LOGIN MODAL ──────────────────────────────────────────────────────────────
function showLoginModal() {
    const lockUntil = isLockedOut();
    const s = getSecState();
    const remaining = lockUntil ? Math.ceil((lockUntil - Date.now()) / 60000) : 0;

    let lockMsg = '';
    if (lockUntil) {
        lockMsg = `< div class="login-error show" >🔒 Too many attempts.Locked for ${remaining} more minute${remaining !== 1 ? 's' : ''}.</div > `;
    }

    document.body.insertAdjacentHTML('beforeend', `
    < div class="login-overlay" id = "login-overlay" >
        <div class="login-box">
            <div class="login-header">
                <div class="login-shield">🔐</div>
                <h2>Admin Access</h2>
                <p>Enter password to continue</p>
            </div>
            ${lockMsg}
            <div id="login-err-msg" class="login-error"></div>
            <div class="login-field">
                <input type="password" id="login-pass" placeholder="Password"
                    onkeydown="if(event.key==='Enter')attemptLogin()"
                    ${lockUntil ? 'disabled' : ''} autocomplete="current-password">
                    <button class="login-eye" onclick="togglePassVis()" title="Show/hide">👁</button>
            </div>
            <div id="attempts-bar" class="attempts-bar" style="display:${s.attempts ? 'block' : 'none'}">
                ${s.attempts ? `<span style="color:var(--accent2)">⚠ ${MAX_ATTEMPTS - (s.attempts || 0)} attempt${MAX_ATTEMPTS - (s.attempts || 0) !== 1 ? 's' : ''} remaining</span>` : ''}
            </div>
            <button class="login-submit" onclick="attemptLogin()" ${lockUntil ? 'disabled' : ''}>
                Unlock Panel
            </button>
            <button class="login-cancel" onclick="dismissLogin()">Cancel</button>
            <div class="login-hint">Hint: Change hash in source to set your password.</div>
        </div>
    </div > `);

    setTimeout(() => document.getElementById('login-pass')?.focus(), 100);
}

function togglePassVis() {
    const inp = document.getElementById('login-pass');
    if (inp) inp.type = inp.type === 'password' ? 'text' : 'password';
}

async function attemptLogin() {
    if (isLockedOut()) return;
    const pass = document.getElementById('login-pass')?.value || '';
    const errEl = document.getElementById('login-err-msg');

    if (!pass) {
        errEl.textContent = '⚠ Please enter a password.';
        errEl.classList.add('show');
        return;
    }

    // Rate-limit delay (increases with attempts)
    const s = getSecState();
    const attempts = s.attempts || 0;
    if (attempts > 0) await new Promise(r => setTimeout(r, Math.min(attempts * 800, 4000)));

    const hash = await sha256(pass);

    if (hash === ADMIN_PASS_HASH) {
        // Success
        setSecState({
            auth: true,
            authExpiry: Date.now() + SESSION_MS,
            attempts: 0
        });
        dismissLogin();
        startSessionTimer();
        document.getElementById('admin-overlay').classList.add('open');
        renderAdminList();
        showToast('✓ Welcome, Admin! Session active for 30 min.');
    } else {
        // Failure
        const newAttempts = attempts + 1;
        let lockUntil = null;
        if (newAttempts >= MAX_ATTEMPTS) {
            lockUntil = Date.now() + LOCKOUT_MS;
            setSecState({
                attempts: newAttempts,
                lockUntil
            });
            errEl.textContent = `🔒 Too many failed attempts.Locked for 15 minutes.`;
            document.getElementById('login-pass').disabled = true;
            document.querySelector('.login-submit').disabled = true;
        } else {
            setSecState({
                attempts: newAttempts
            });
            const left = MAX_ATTEMPTS - newAttempts;
            errEl.textContent = `✗ Incorrect password.${left} attempt${left !== 1 ? 's' : ''} remaining.`;
            const bar = document.getElementById('attempts-bar');
            if (bar) {
                bar.style.display = 'block';
                bar.innerHTML = `< span style = "color:var(--accent2)" >⚠ ${left} attempt${left !== 1 ? 's' : ''} remaining</span > `;
            }
        }
        errEl.classList.add('show');
        document.getElementById('login-pass').value = '';
        document.getElementById('login-pass').focus();
        // Shake animation
        document.querySelector('.login-box').classList.add('shake');
        setTimeout(() => document.querySelector('.login-box')?.classList.remove('shake'), 500);
    }
}

function dismissLogin() {
    document.getElementById('login-overlay')?.remove();
}

// Add logout button to admin header dynamically
function renderAdminList() {
    // Inject logout button if not present
    const header = document.querySelector('.admin-header');
    if (header && !header.querySelector('.logout-btn')) {
        const s = getSecState();
        const expMins = s.authExpiry ? Math.ceil((s.authExpiry - Date.now()) / 60000) : 0;
        header.insertAdjacentHTML('beforeend',
            `< button class="logout-btn" onclick = "logout()" title = "End session" >🔓 Logout</button > `);
    }

    const tagMap = {
        alert: '#ff3d5a',
        guide: '#7fff6e',
        news: '#00e5ff'
    };
    const container = document.getElementById('admin-post-list');
    if (!posts.length) {
        container.innerHTML = '<div style="color:var(--text-dim);font-family:Space Mono,monospace;font-size:.75rem;text-align:center;padding:20px">No posts yet.</div>';
        return;
    }
    container.innerHTML = posts.map(p => `
    < div class="post-item" >
      <div class="post-item-title">${escHtml(p.title)}</div>
      <span class="post-item-tag" style="background:${tagMap[p.category]}22;color:${tagMap[p.category]};border:1px solid ${tagMap[p.category]}44">${p.category}</span>
      <button class="del-btn" onclick="deletePost('${p.id}')">✕ Del</button>
    </div > `).join('');
}

function addPost() {
    const title = document.getElementById('f-title').value.trim();
    const cat = document.getElementById('f-cat').value;
    const summary = document.getElementById('f-summary').value.trim();
    const content = document.getElementById('f-content').value.trim();
    const author = document.getElementById('f-author').value.trim() || 'CyberSafe Team';
    const emoji = document.getElementById('f-emoji').value.trim() || '🛡';
    const featured = document.getElementById('f-featured').value === 'true';

    if (!title || !summary || !content) {
        showToast('⚠ Please fill all required fields.', '#ff3d5a');
        return;
    }

    const newPost = {
        id: 'p' + Date.now(),
        title,
        category: cat,
        summary,
        content,
        author,
        emoji,
        featured,
        date: new Date().toISOString().split('T')[0]
    };

    // If new post is featured, unfeature previous featured
    if (featured) {
        posts.forEach(p => {
            p.featured = false;
        });
    }

    posts.unshift(newPost);
    savePosts();
    renderBlog();
    renderAdminList();
    showToast('✓ Post published successfully!');

    // Clear form
    ['f-title', 'f-summary', 'f-content'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('f-emoji').value = '🛡';
    document.getElementById('f-featured').value = 'false';
}

function deletePost(id) {
    if (!confirm('Delete this post?')) return;
    posts = posts.filter(p => p.id !== id);
    savePosts();
    renderBlog();
    renderAdminList();
    showToast('Post deleted.', '#ff3d5a');
}



// ─── TOAST ────────────────────────────────────────────────────────────────────
function showToast(msg, bg = '#7fff6e') {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.style.background = bg;
    t.style.color = bg === '#7fff6e' ? '#000' : '#fff';
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2800);
}

// ─── LIVE NEWS via Claude API ─────────────────────────────────────────────────
async function fetchLiveNews() {

    const grid = document.getElementById('live-grid');

    grid.innerHTML = `
        <div class="live-loading">
            <span class="spinner"></span>
            Loading Threat Intelligence Feed...
        </div>
    `;

    try {

        const response = await fetch('/api/news');

        const articles = await response.json();

        renderLiveNews(articles);

    } catch (error) {

        grid.innerHTML = `
            <div class="live-error">
                Failed to connect to Cyber Intelligence Server.
            </div>
        `;

        console.error(error);
    }
}

function renderLiveNews(articles) {

    const grid = document.getElementById('live-grid');

    if (!articles.length) {

        grid.innerHTML = `
            <div class="live-loading">
                No live threat reports available.
            </div>
        `;

        return;
    }

    grid.innerHTML = articles.map(article => `

        <div class="live-card">

            <div class="live-card-source">
                ${article.source}
            </div>

            <h4>${article.title}</h4>

            <p>${article.summary}</p>

            <div class="live-card-time">
                ${article.time}
            </div>

        </div>

    `).join('');
}
// ─── SECRET ADMIN ACCESS ──────────────────────────────────────────────────────
// Method 1: Press Ctrl + Shift + A
document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        openAdmin();
    }
});

// Method 2: Triple-click the logo
let logoClicks = 0,
    logoTimer;
document.querySelector('.logo').addEventListener('click', function () {
    logoClicks++;
    clearTimeout(logoTimer);
    logoTimer = setTimeout(() => {
        logoClicks = 0;
    }, 800);
    if (logoClicks >= 3) {
        logoClicks = 0;
        openAdmin();
    }
});

// ─── INIT ─────────────────────────────────────────────────────────────────────
loadPosts();
buildTicker();
buildStats();
renderBlog();
fetchLiveNews();

// Close overlay on outside click
document.getElementById('admin-overlay').addEventListener('click', function (e) {
    if (e.target === this) closeAdmin();
});

let cyberCount = 1247;

setInterval(() => {

    cyberCount += Math.floor(Math.random() * 5);

    document.getElementById('attackCounter')
        .innerText = cyberCount;

}, 2000);

const canvas =
    document.getElementById('matrixCanvas');

const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const letters =
    '01CYBERSAFE';

const fontSize = 14;

const columns =
    canvas.width / fontSize;

const drops = [];

for (let i = 0; i < columns; i++) {

    drops[i] = 1;
}

function drawMatrix() {

    ctx.fillStyle =
        'rgba(0,0,0,0.05)';

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle = '#00e5ff';

    ctx.font =
        fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {

        const text =
            letters[Math.floor(
                Math.random() *
                letters.length
            )];

        ctx.fillText(
            text,
            i * fontSize,
            drops[i] * fontSize
        );

        if (
            drops[i] * fontSize >
            canvas.height &&
            Math.random() > 0.975
        ) {

            drops[i] = 0;
        }

        drops[i]++;
    }
}

setInterval(drawMatrix, 35);

function toggleAIChat() {

    const chat =
        document.getElementById('aiChat');

    if (chat.style.display === 'flex') {

        chat.style.display = 'none';
    } else {

        chat.style.display = 'flex';
    }
}

function sendAIMessage() {

    const input =
        document.getElementById('aiInput');

    const messages =
        document.getElementById('aiMessages');

    const text = input.value;

    if (!text) return;

    messages.innerHTML += `

        <div class="ai-message user">

            ${text}

        </div>

    `;

    let reply =
        'Stay alert and avoid suspicious links.';

    const lower =
        text.toLowerCase();

    if (lower.includes('upi')) {

        reply =
            'Never approve unknown UPI collect requests.';
    } else if (lower.includes('otp')) {

        reply =
            'Never share OTP with anyone.';
    } else if (lower.includes('phishing')) {

        reply =
            'Check URLs carefully before logging in.';
    } else if (lower.includes('telegram')) {

        reply =
            'Beware of fake investment and job scams.';
    }

    setTimeout(() => {

        messages.innerHTML += `

            <div class="ai-message bot">

                ${reply}

            </div>

        `;

        messages.scrollTop =
            messages.scrollHeight;

    }, 700);

    input.value = '';
}


const threatAlerts = [

    '🚨 Fake UPI collect request detected',

    '⚠ New phishing campaign targeting banks',

    '🛡 CERT-In issued malware advisory',

    '🚔 Telegram crypto scam expanding',

    '⚡ AI deepfake scam reported in India'

];

function showThreatPopup() {

    const popup =
        document.getElementById('popupAlert');

    const randomAlert =

        threatAlerts[
        Math.floor(
            Math.random() *
            threatAlerts.length
        )
        ];

    popup.innerText = randomAlert;

    popup.style.display = 'block';

    setTimeout(() => {

        popup.style.display = 'none';

    }, 4000);
}

setInterval(showThreatPopup, 12000);


async function loadThreatFeed() {

    const container =
        document.getElementById('threatFeed');

    try {

        const response =
            await fetch('/api/live-threats');

        const threats =
            await response.json();

        container.innerHTML = '';

        threats.forEach(threat => {

            container.innerHTML += `

<div class="threat-card">

    <div class="threat-top">

        <div class="threat-type">

            ${threat.type}

        </div>

        <div class="severity severity-${threat.severity.toLowerCase()}">

            ${threat.severity}

        </div>

    </div>

    <div class="threat-domain">

        ${threat.domain}

    </div>

    <div class="threat-url">

        ${threat.url}

    </div>

    <div class="threat-status">

        ● LIVE THREAT FEED

    </div>

</div>
`;
        });

    } catch (error) {

        container.innerHTML = `

            <div class="live-error">

                Failed to load live threat feed.

            </div>

        `;
    }
}

loadThreatFeed();

setInterval(loadThreatFeed, 60000);


async function searchIOC() {

    const input =

        document.getElementById('iocInput')
            .value
            .toLowerCase();

    const result =

        document.getElementById('iocResult');

    if (!input) {

        result.innerHTML = '';

        return;
    }

    try {

        const response =

            await fetch('/api/live-threats');

        const threats =

            await response.json();

        const found = threats.find(threat =>

            threat.url.toLowerCase().includes(input)
            ||

            threat.domain.toLowerCase().includes(input)
        );

        if (found) {

            result.innerHTML = `

                <div class="ioc-danger">

                    ⚠ MALICIOUS IOC DETECTED

                    <br><br>

                    Domain:
                    ${found.domain}

                    <br><br>

                    Severity:
                    ${found.severity}

                </div>

            `;
        }

        else {

            result.innerHTML = `

                <div class="ioc-safe">

                    ✔ No threat intelligence match found.

                </div>

            `;
        }

    }

    catch (error) {

        result.innerHTML = `

            <div class="live-error">

                IOC analysis failed.

            </div>

        `;
    }
}


const attackTypes = [

    'Phishing Campaign',
    'Credential Theft',
    'UPI Fraud Attempt',
    'Ransomware Activity',
    'Malicious Login Attempt',
    'Telegram Scam',
    'QR Code Fraud',
    'Deepfake Attack'

];

const locations = [

    'Mumbai',
    'Delhi',
    'Bengaluru',
    'Hyderabad',
    'Chennai',
    'Kolkata',
    'Guwahati',
    'Pune'

];

function generateAttackLog() {

    const stream =
        document.getElementById('attackStream');

    const type =

        attackTypes[
        Math.floor(
            Math.random() *
            attackTypes.length
        )
        ];

    const location =

        locations[
        Math.floor(
            Math.random() *
            locations.length
        )
        ];

    const log = document.createElement('div');

    log.className = 'attack-log';

    log.innerHTML = `

        <div class="attack-time">

            ${new Date().toLocaleTimeString()}

        </div>

        <div class="attack-type">

            ${type}

        </div>

        <div class="attack-location">

            Target Region:
            ${location}

        </div>

    `;

    stream.prepend(log);

    if (stream.children.length > 8) {

        stream.removeChild(
            stream.lastChild
        );
    }
}

setInterval(generateAttackLog, 3000);

for (let i = 0; i < 5; i++) {

    generateAttackLog();
}
/* INDIA MAP */

const indiaMap = L.map('indiaThreatMap').setView(

    [22.9734, 78.6569],

    5

);

L.tileLayer(

    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',

    {

        attribution: 'CyberSafe India'

    }

).addTo(indiaMap);

/* THREAT LOCATIONS */

const cyberThreats = [

    {
        city: 'Delhi',
        coords: [28.6139, 77.2090],
        type: 'UPI Fraud'
    },

    {
        city: 'Mumbai',
        coords: [19.0760, 72.8777],
        type: 'Phishing Attack'
    },

    {
        city: 'Bengaluru',
        coords: [12.9716, 77.5946],
        type: 'Ransomware'
    },

    {
        city: 'Hyderabad',
        coords: [17.3850, 78.4867],
        type: 'Deepfake Scam'
    },

    {
        city: 'Guwahati',
        coords: [26.1445, 91.7362],
        type: 'Telegram Scam'
    }

];

cyberThreats.forEach(threat => {

    const marker = L.circleMarker(

        threat.coords,

        {

            radius: 12,

            color: '#ff3d5a',

            fillColor: '#ff3d5a',

            fillOpacity: 0.6

        }

    ).addTo(indiaMap);

    marker.bindPopup(`

        <b>${threat.city}</b>

        <br>

        ${threat.type}

    `);
});

setInterval(() => {

    cyberThreats.forEach(threat => {

        L.circle(

            threat.coords,

            {

                radius: 50000,

                color: '#ff3d5a',

                fillOpacity: 0.05

            }

        ).addTo(indiaMap);

    });

}, 4000);