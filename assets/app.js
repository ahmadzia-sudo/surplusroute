/* ============================================================
   SurplusRoute — prototype logic
   No backend. All data below is dummy data held in the browser
   so the prototype can be clicked through end to end.
   ============================================================ */

const DEMO_ACCOUNTS = [
  { email: 'sunil@bakery.ae',   password: 'demo1234', role: 'outlet', name: 'Sunil Varghese', org: 'Al Barsha Bakery House' },
  { email: 'maria@worker.ae',   password: 'demo1234', role: 'user',   name: 'Maria Santos',   org: 'Sharjah' },
  { email: 'admin@surplusroute.ae', password: 'demo1234', role: 'admin', name: 'Admin', org: 'SurplusRoute' }
];

const SEED_LISTINGS = [
  {
    id: 'L-2481', outlet: 'Al Barsha Bakery House', area: 'Al Barsha 1, Dubai',
    item: 'Mixed pastry box', portions: 6, claimed: 2, type: 'discount',
    discount: 70, was: 40, now: 12, closes: '22:30', distance: 0.7, mine: true
  },
  {
    id: 'L-2478', outlet: 'Al Barsha Bakery House', area: 'Al Barsha 1, Dubai',
    item: 'Sandwich selection', portions: 4, claimed: 4, type: 'free',
    discount: 100, was: 22, now: 0, closes: '22:30', distance: 0.7, mine: true
  },
  {
    id: 'L-2465', outlet: 'Karama Kitchen', area: 'Al Karama, Dubai',
    item: 'Biryani portions', portions: 8, claimed: 3, type: 'discount',
    discount: 60, was: 25, now: 10, closes: '23:00', distance: 1.4, mine: false
  },
  {
    id: 'L-2459', outlet: 'Green Fork Cafe', area: 'Al Quoz, Dubai',
    item: 'Soup and bread', portions: 5, claimed: 1, type: 'free',
    discount: 100, was: 18, now: 0, closes: '21:45', distance: 2.1, mine: false
  },
  {
    id: 'L-2452', outlet: 'Corniche Grill', area: 'Al Nahda, Sharjah',
    item: 'Grilled chicken meal', portions: 3, claimed: 0, type: 'discount',
    discount: 65, was: 35, now: 12, closes: '23:30', distance: 3.4, mine: false
  },
  {
    id: 'L-2447', outlet: 'Daily Bread Co.', area: 'Al Nahda, Sharjah',
    item: 'Bread and rolls', portions: 10, claimed: 6, type: 'free',
    discount: 100, was: 15, now: 0, closes: '22:00', distance: 3.9, mine: false
  }
];

const SEED_VERIFICATIONS = [
  { id: 'V-1043', name: 'Emmanuel Kato',  submitted: '27 Sep, 09:12', emirate: 'Dubai',   docs: 'Emirates ID', status: 'pending' },
  { id: 'V-1042', name: 'Rekha Pillai',   submitted: '27 Sep, 08:40', emirate: 'Sharjah', docs: 'Emirates ID', status: 'pending' },
  { id: 'V-1041', name: 'Abdul Rahman',   submitted: '26 Sep, 19:55', emirate: 'Dubai',   docs: 'Emirates ID + declaration', status: 'pending' },
  { id: 'V-1038', name: 'Maria Santos',   submitted: '24 Sep, 14:02', emirate: 'Sharjah', docs: 'Emirates ID', status: 'approved' },
  { id: 'V-1035', name: 'Joseph Mwangi',  submitted: '23 Sep, 11:30', emirate: 'Ajman',   docs: 'Emirates ID', status: 'approved' }
];

const SEED_CLAIMS = [
  { id: 'C-770', code: 'K4M2', item: 'Bread and rolls',  outlet: 'Daily Bread Co.', when: '25 Sep', status: 'Collected', paid: 'Free' },
  { id: 'C-764', code: 'P9TQ', item: 'Biryani portions', outlet: 'Karama Kitchen',  when: '23 Sep', status: 'Collected', paid: 'AED 10' },
  { id: 'C-751', code: 'B2XR', item: 'Soup and bread',   outlet: 'Green Fork Cafe', when: '21 Sep', status: 'Expired',   paid: '—' }
];

/* ---------- tiny storage helpers ---------- */

const Store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem('sr_' + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem('sr_' + key, JSON.stringify(value)); } catch (e) {}
  },
  clear() {
    try {
      Object.keys(localStorage)
        .filter(k => k.startsWith('sr_'))
        .forEach(k => localStorage.removeItem(k));
    } catch (e) {}
  }
};

function listings() {
  const extra = Store.get('newListings', []);
  return extra.concat(SEED_LISTINGS);
}

function findListing(id) {
  return listings().find(l => l.id === id) || null;
}

function currentUser() {
  return Store.get('session', null);
}

function requireRole(role, redirect) {
  const u = currentUser();
  if (!u || (role && u.role !== role)) {
    window.location.href = redirect || 'login.html';
    return null;
  }
  return u;
}

function signOut() {
  Store.set('session', null);
  window.location.href = 'index.html';
}

function makeCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 4; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function money(n) {
  return 'AED ' + Number(n).toFixed(0);
}

/* ---------- shared header ---------- */

const NAV_BY_ROLE = {
  outlet: [
    { href: 'outlet-dashboard.html', label: 'Listings' },
    { href: 'outlet-new-listing.html', label: 'List surplus' }
  ],
  user: [
    { href: 'user-browse.html', label: 'Available nearby' },
    { href: 'user-claims.html', label: 'My collections' }
  ],
  admin: [
    { href: 'admin-dashboard.html', label: 'Overview' },
    { href: 'admin-review.html', label: 'Verifications' }
  ]
};

function buildHeader() {
  const mount = document.querySelector('[data-header]');
  if (!mount) return;

  const user = currentUser();
  const here = window.location.pathname.split('/').pop() || 'index.html';
  const links = user ? (NAV_BY_ROLE[user.role] || []) : [];

  const navLinks = links.map(l =>
    `<a href="${l.href}"${l.href === here ? ' aria-current="page"' : ''}>${l.label}</a>`
  ).join('');

  const tail = user
    ? `<span class="meta">${user.name}</span>
       <button class="btn btn-secondary btn-sm" type="button" data-signout>Sign out</button>`
    : `<a class="btn btn-secondary btn-sm" href="login.html">Sign in</a>
       <a class="btn btn-primary btn-sm" href="signup.html">Create account</a>`;

  mount.innerHTML = `
    <div class="shell masthead-inner">
      <a class="brand" href="${user ? (links[0] ? links[0].href : 'index.html') : 'index.html'}">
        <img src="assets/logo.png" alt="SurplusRoute">
      </a>
      <span class="chip-demo">Prototype</span>
      <button class="nav-toggle" type="button" data-nav-toggle aria-expanded="false">Menu</button>
      <nav class="nav" data-nav>${navLinks}${tail}</nav>
    </div>`;

  const toggle = mount.querySelector('[data-nav-toggle]');
  const nav = mount.querySelector('[data-nav]');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  const out = mount.querySelector('[data-signout]');
  if (out) out.addEventListener('click', signOut);
}

function buildFooter() {
  const mount = document.querySelector('[data-footer]');
  if (!mount) return;
  mount.innerHTML = `
    <div class="shell">
      <p class="tight">SurplusRoute prototype. Sample data only, built for a design thinking project.
      <a href="index.html">Start over</a></p>
    </div>`;
}

document.addEventListener('DOMContentLoaded', () => {
  buildHeader();
  buildFooter();
});
