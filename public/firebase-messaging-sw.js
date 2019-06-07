importScripts('https://www.gstatic.com/firebasejs/5.8.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.8.3/firebase-messaging.js');

var config = {
    apiKey: "AIzaSyAtB-SuAHKeSNrfvtc7PyXIPGsM_iYH5I4",
    authDomain: "xsociales-da4da.firebaseapp.com",
    databaseURL: "https://xsociales-da4da.firebaseio.com",
    projectId: "xsociales-da4da",
    storageBucket: "xsociales-da4da.appspot.com",
    messagingSenderId: "547996256165",
    appId: "1:547996256165:web:f780ea87188714fc"
  };
  firebase.initializeApp(config);

var messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload) {
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: payload.data.icon,
    badge: payload.data.badge
  };

  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});

var CACHE_NAME = 'v1';
var urlsToCache = [
  '/'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(names) {
      for (let name of names)
        caches.delete(name);
    })
  );
});