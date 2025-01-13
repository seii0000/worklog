// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBvKkpUNy1KqyE2LzZZKic1vu4pody4fGU",
  authDomain: "nextjs-worklog-app.firebaseapp.com",
  projectId: "nextjs-worklog-app",
  storageBucket: "nextjs-worklog-app.firebasestorage.app",
  messagingSenderId: "50437099751",
  appId: "1:50437099751:web:4f5c728f2c6756f262d242",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);