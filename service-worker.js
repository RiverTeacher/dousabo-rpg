// service-worker.js

const CACHE_NAME = 'dousabo-cache-v1';
const urlsToCache = [
  '/', // ホームページ
  '/index.html', // メインページ
  '/manifest.json', // マニフェストファイル
  '/dousabo-rpg/1000046321.png', // 画像
  '/style.css', // スタイル
  '/app.js', // スクリプト
];

// インストール時にキャッシュを作成
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: キャッシュ作成');
      return cache.addAll(urlsToCache);
    })
  );
});

// fetch イベントでキャッシュを利用（オフライン対応）
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});

// サービスワーカーのアクティベーション
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
