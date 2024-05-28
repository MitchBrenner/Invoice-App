import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY, // THIS MIGHT NEED TO BE CHANGED TO PULIC
    authDomain: "invoice-app-6bb43.firebaseapp.com",
    projectId: "invoice-app-6bb43",
    storageBucket: "invoice-app-6bb43.appspot.com",
    messagingSenderId: "433026509821",
    appId: "1:433026509821:web:f13d36c4aea6c011d20794"
  };


  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    const db = getFirestore(app);
    const storage = getStorage(app);

    export { db, storage }