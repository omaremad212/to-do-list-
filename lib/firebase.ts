import { initializeApp, getApps, FirebaseApp, getApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

let firebaseApp: FirebaseApp | null = null;
let firebaseDb: Firestore | null = null;
let firebaseStorage: FirebaseStorage | null = null;

function getFirebaseApp(): FirebaseApp {
  if (!firebaseApp) {
    if (getApps().length === 0) {
      firebaseApp = initializeApp(firebaseConfig);
    } else {
      firebaseApp = getApp();
    }
  }
  return firebaseApp;
}

function getFirebaseDb(): Firestore {
  if (!firebaseDb) {
    const app = getFirebaseApp();
    firebaseDb = getFirestore(app);
  }
  return firebaseDb;
}

function getFirebaseStorageFunc(): FirebaseStorage {
  if (!firebaseStorage) {
    const app = getFirebaseApp();
    firebaseStorage = getStorage(app);
  }
  return firebaseStorage;
}

export const db = getFirebaseDb();
export const storage = getFirebaseStorageFunc();

export async function getFirebaseAuth() {
  const { getAuth } = await import('firebase/auth');
  return getAuth(getFirebaseApp());
}