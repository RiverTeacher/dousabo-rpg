// service-worker.js

self.addEventListener('install', event => {
  // インストール時に即座にアクティブに
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  // アクティブになったらすぐにクライアントを制御
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // 以下のリクエストはブラウザに任せる（アイコン・manifest・favicon など）
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

  // ネットワークオンリー戦略
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        // ネットワークエラー時のレスポンス
        return new Response('ネットワークエラーが発生しました。', {
          status: 408,
          statusText: 'Network Error',
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      })
  );
});
