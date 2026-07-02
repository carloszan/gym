import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore, Firestore } from 'firebase-admin/firestore'

function getAdminDb(): Firestore {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    })
  }
  return getFirestore()
}

// Lazy: real Firebase init only happens on first actual use (a request at
// runtime), not at module import time. Next.js imports route modules during
// `next build` to collect page data, which would otherwise crash the build
// when Firebase credentials aren't present in the build environment.
export const adminDb = new Proxy({} as Firestore, {
  get(_target, prop) {
    const db = getAdminDb()
    const value = Reflect.get(db, prop, db)
    return typeof value === 'function' ? value.bind(db) : value
  },
})
