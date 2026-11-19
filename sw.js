/* sw.js — تنزيل من كروم + شغل أوفلاين + يحمّل الإضافات (inapp / brand) لوحده من غير ما تعدّل index.html */
const V = 'deen-v6';
const CORE = ['./', 'index.html', 'quran.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png',
  'inapp.js', 'brand.js', 'brand.css', 'logo-mark.svg', 'extra-data.js', 'images.js'];
const HEAD = '<link rel="stylesheet" href="brand.css"><script src="brand.js"></script>';
const TAIL = '<script src="inapp.js"></script>';

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(V).then(c => Promise.all(CORE.map(u => c.add(u).catch(() => {})))));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())
  );
});

/* يجيب الصفحة الرئيسية ويضيف الملفات اللي ناقصة (لو أنت ضفتها بإيدك مش هيكررها) */
async function mainPage(r) {
  const res = await fetch(r);
  if (!res.ok || !(res.headers.get('content-type') || '').includes('text/html')) return res;
  let t = await res.text();
  if (!t.includes('brand.css') && t.includes('</head>')) t = t.replace('</head>', HEAD + '\n</head>');
  if (!t.includes('inapp.js') && t.includes('</body>')) t = t.replace('</body>', TAIL + '\n</body>');
  return new Response(t, { status: res.status, statusText: res.statusText, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin !== location.origin) return;                 // يوتيوب والخطوط وغيرهم: مش بنتدخل
  const isMain = r.mode === 'navigate' && /(\/|\/index\.html)$/.test(u.pathname);
  e.respondWith(
    (isMain ? mainPage(r) : fetch(r)).then(res => {
      if (res && res.ok) { const copy = res.clone(); caches.open(V).then(c => c.put(r, copy)).catch(() => {}); }
      return res;
    }).catch(() =>
      caches.match(r, { ignoreSearch: true }).then(m => m || (r.mode === 'navigate' ? caches.match('index.html') : Response.error()))
    )
  );
});
