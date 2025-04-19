// service-worker.js

self.addEventListener('install', (event) => {
  // 即時有効化
  self.skipWaiting();
  console.log('Service Worker installed (no cache).');
});

self.addEventListener('activate', (event) => {
  // クライアントをすぐにコントロール
  event.waitUntil(self.clients.claim());
  console.log('Service Worker activated (no cache).');
});

self.addEventListener('fetch', (event) => {
  // 常にネットワークから取得
  event.respondWith(
    fetch(event.request).catch(() => {
      // ネットワークエラー時のフォールバック（必要ならここに記述）
      return new Response('Network error occurred', {
        status: 408,
        statusText: 'Network Timeout',
      });
    })
  );
});
