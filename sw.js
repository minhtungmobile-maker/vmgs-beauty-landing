/* * 🔐 HSTAI 777 x V MASTER - OFFLINE ENGINE
 * 🏛 CHIẾN LƯỢC: CHẠY BỀN BỈ 777 NĂM
 */

const CACHE_NAME = 'vmgs-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/main.css',
  '/layout.css',
  '/main.js',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 VMGS: Niêm phong tài nguyên vào Cache');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Trả về từ cache nếu có, nếu không thì lấy từ mạng
      return response || fetch(event.request);
    })
  );
});