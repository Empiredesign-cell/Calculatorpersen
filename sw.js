/* Kalkulin PWA offline shell • Increment APP_VERSION on release */
const APP_VERSION = 'kalkulin-2.1.0-v1';
const SHELL_FILES = [
  './index.html',
  './styles.css',
  './app.js',
  './calculators.mjs',
  './manifest.webmanifest',
  './favicon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(APP_VERSION).then(cache => cache.addAll(SHELL_FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(Promise.all([
    caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('kalkulin-') && key !== APP_VERSION).map(key => caches.delete(key)))),
    self.clients.claim()
  ]));
});
self.addEventListener('fetch', event => {
  if(event.request.method !== 'GET')return;
  const req = event.request;
  const url = new URL(req.url);
  if(url.origin !== self.location.origin) return; // Never cache the external live FX API.
  if(req.mode === 'navigate'){
    event.respondWith(fetch(req).then(response => {
      if(response.ok){const copy=response.clone();caches.open(APP_VERSION).then(c=>c.put('./index.html',copy)).catch(()=>{});}
      return response;
    }).catch(async()=>await caches.match('./index.html') || Response.error()));
    return;
  }
  event.respondWith(caches.match(req).then(hit=>hit || fetch(req).then(res=>{
    if(res.ok){const clone=res.clone();caches.open(APP_VERSION).then(c=>c.put(req,clone)).catch(()=>{});}
    return res;
  })));
});
