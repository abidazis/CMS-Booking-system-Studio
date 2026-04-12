// File: src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// PASTE FIREBASE CONFIG KAMU DI SINI:
const firebaseConfig = {
  apiKey: "AIzaSyDeY8c5o2m1j9oBbZtxsoZPOe_C2VkDIsk",
  authDomain: "ayustudio-booking.firebaseapp.com",
  projectId: "ayustudio-booking",
  storageBucket: "ayustudio-booking.firebasestorage.app",
  messagingSenderId: "374878980424",
  appId: "1:374878980424:web:757591a982f2c32d160b7d",
  measurementId: "G-W6834JLVHE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);