const V='v3';
const PRE=['/','/index.html','/styles.css','/app.js','/manifest.json','/icon.svg'];

self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(PRE).catch(()=>{})));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{
  if(e.request.url.includes('googleapis')||e.request.url.includes('firestore'))return;
  e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{if(r.ok){const rc=r.clone();caches.open(V).then(c=>c.put(e.request,rc));}return r;}).catch(()=>c||new Response('离线',{status:503}))));
});
