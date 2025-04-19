// fetch イベントでネットワークを優先（オフライン対応）
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // ネットワークから取得成功
        // キャッシュも更新しておく (任意)
        return caches.open(CACHE_NAME).then((cache) => {
          // networkResponseは一度しか読めないのでcloneする
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      })
      .catch(() => {
        // ネットワークから取得失敗 (オフラインなど)
        // キャッシュから探してみる
        return caches.match(event.request).then((cachedResponse) => {
          // キャッシュがあればそれを返す
          // キャッシュもなければ、ここでさらに代替レスポンス (例: オフライン用ページ) を返すことも可能
          return cachedResponse || Response.error(); // または適切なフォールバック
        });
      })
  );
});
