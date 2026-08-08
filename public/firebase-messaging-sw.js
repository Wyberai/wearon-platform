// firebase-messaging-sw.js
// Inject NEXT_PUBLIC_FIREBASE_* vars via next.config.ts publicRuntimeConfig or env substitution at build time

importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js')

// These placeholder values are replaced at build time via next.config.ts
// (e.g., using next-pwa's swDest + additionalManifestEntries, or a custom build script
// that runs `sed` / string replacement on the built SW file).
firebase.initializeApp({
  apiKey: self.FIREBASE_API_KEY || '%%NEXT_PUBLIC_FIREBASE_API_KEY%%',
  authDomain: self.FIREBASE_AUTH_DOMAIN || '%%NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN%%',
  projectId: self.FIREBASE_PROJECT_ID || '%%NEXT_PUBLIC_FIREBASE_PROJECT_ID%%',
  storageBucket: self.FIREBASE_STORAGE_BUCKET || '%%NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET%%',
  messagingSenderId: self.FIREBASE_MESSAGING_SENDER_ID || '%%NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID%%',
  appId: self.FIREBASE_APP_ID || '%%NEXT_PUBLIC_FIREBASE_APP_ID%%',
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title ?? 'New notification'
  const body = payload.notification?.body ?? ''

  self.registration.showNotification(title, {
    body,
    icon: '/icon-192.png',
  })
})
