// UNISELL Service Worker v1.0
const CACHE_NAME = 'unisell-v3';
const OFFLINE_URL = '/offline.html';

// Files to cache for offline use
const CACHE_FILES = [
  '/',
  '/index.html',
  '/login.html',
  '/dashboard.html',
  '/manifest.json',
  '/offline.html',
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js'
];

// Install — cache essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CACHE_FILES).catch(err => {
        console.log('Cache addAll error (some files may fail):', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch — serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip Firebase and API requests — always go to network
  const url = event.request.url;
  if (
    url.includes('firebase') ||
    url.includes('googleapis.com/identitytoolkit') ||
    url.includes('securetoken') ||
    url.includes('/api/chat') ||
    url.includes('groq.com') ||
    url.includes('anthropic.com')
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      // Return cached version if available
      if (cached) return cached;

      // Otherwise fetch from network
      return fetch(event.request)
        .then((response) => {
          // Cache successful responses
          if (response && response.status === 200 && response.type === 'basic') {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clone);
            });
          }
          return response;
        })
        .catch(() => {
          // If both cache and network fail, show offline page
          if (event.request.destination === 'document') {
            return caches.match(OFFLINE_URL);
          }
        });
    })
  );
});

// Background sync for when connection returns
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    console.log('Background sync triggered');
  }
});

// Push notifications (future use)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    self.registration.showNotification(data.title || 'UNISELL', {
      body: data.body || 'You have a new notification',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-72.png',
      data: data
    });
  }
});
