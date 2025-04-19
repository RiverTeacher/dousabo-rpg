self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.ico') ||
    url.pathname.includes('dousabo192') ||
    url.pathname.includes('dousabo512') ||
    url.pathname.endsWith('manifest.json')
  ) {
    return; // ブラウザに任せる
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      return new Response('ネットワークエラーが発生しました。', {
        status: 408,
        statusText: 'Network Error'
      });
    })
  );
});
