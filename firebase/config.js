import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "nextjs-github-apphosting.firebaseapp.com",
  projectId: "nextjs-github-apphosting",
  storageBucket: "nextjs-github-apphosting.firebasestorage.app",
  messagingSenderId: "724148850885",
  appId: "1:724148850885:web:8394f8295f89cec58520ac",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
