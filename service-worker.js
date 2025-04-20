// service-worker.js

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  const isBypassRequest = (
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.ico') ||
    url.pathname.endsWith('manifest.json') ||
    url.pathname.includes('dousabo192') ||
    url.pathname.includes('dousabo512')
  );

  if (isBypassRequest) {
    return;
  }

  event.respondWith(
    fetch(event.request, { cache: "no-store" })
      .catch(() => {
        return new Response('ネットワークエラーが発生しました。', {
          status: 408,
          statusText: 'Network Error',
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      })
  );
});
