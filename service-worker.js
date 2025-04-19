// fetch イベントでネットワークを優先（オフライン対応）
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // ネットワークから取得成功
        // レスポンスが正常 (status 200-299) かつ null でないことを確認
        if (networkResponse && networkResponse.ok) {
          // キャッシュも更新しておく
          // networkResponseは一度しか読めないのでcloneする
          const responseToCache = networkResponse.clone(); // クローンを作成
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache); // クローンをキャッシュに入れる
          });
        }
        // どのようなレスポンスであれ、元のネットワークレスポンスをブラウザに返す
        return networkResponse;
      })
      .catch(() => {
        // ネットワークから取得失敗 (オフラインなど)
        // キャッシュから探してみる
        console.log('Network failed, trying cache for:', event.request.url); // デバッグ用ログ
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log('Cache hit for:', event.request.url); // デバッグ用ログ
            return cachedResponse;
          } else {
            console.log('Cache miss for:', event.request.url); // デバッグ用ログ
            // キャッシュにもなければエラーレスポンスを返す (またはオフラインページなど)
            // Response.error() は時々 ERR_FAILED を引き起こす可能性があるので注意
            // 代わりに new Response(...) でカスタムエラーページを返す方が安定するかも
            return Response.error();
            // return new Response("Network error and no cache available.", { status: 503, statusText: "Service Unavailable" });
          }
        });
      })
  );
});
