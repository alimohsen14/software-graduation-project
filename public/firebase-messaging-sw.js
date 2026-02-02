// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyC7cmo14o88QUrhx-1A9JJ4daeyzmZINjE",
    authDomain: "palestine3d-3ba18.firebaseapp.com",
    projectId: "palestine3d-3ba18",
    storageBucket: "palestine3d-3ba18.firebasestorage.app",
    messagingSenderId: "962047427867",
    appId: "1:962047427867:web:5eed368fad82163b4abfbe",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.image || '/logo192.png',
        data: payload.data
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
