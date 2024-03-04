/* eslint-disable no-undef */

importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBwEMWipRpEK4KPpNFANejxHxWmcmzKC7M",
  authDomain: "mofidapp-fd424.firebaseapp.com",
  projectId: "mofidapp-fd424",
  storageBucket: "mofidapp-fd424.appspot.com",
  messagingSenderId: "692298813335",
  appId: "1:692298813335:web:389c06218aab31bba4fed2",
  measurementId: "G-277NP8DBL7",
});

const isSupported = firebase.messaging.isSupported();
if (isSupported) {
  const messaging = firebase.messaging();
  messaging.onBackgroundMessage(({ notification: { title, body, image } }) => {
    self.registration.showNotification(title, {
      body,
      icon: image || "/icon-512x512.png",
    });
  });
}