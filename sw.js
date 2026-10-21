const C='jp-v10';
const CORE=['./','index.html','manifest.json','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET')return;
  const isFont=u.host.includes('fonts.g');
  if(u.origin!==location.origin&&!isFont)return;
  // stranka: najprv siet (aby sa nove tipy hned ukazali), offline z cache
  if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).then(r=>{const cl=r.clone();caches.open(C).then(c=>c.put('index.html',cl));return r}).catch(()=>caches.match('index.html')));return}
  e.respondWith(caches.match(e.request).then(m=>m||fetch(e.request).then(r=>{if(r.ok||r.type==='opaque'){const cl=r.clone();caches.open(C).then(c=>c.put(e.request,cl))}return r})));
});
