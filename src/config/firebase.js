// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDQV9Ug6NDAmLN-r_cOcmGaA2agINXrUzo",
  authDomain: "quizsite-cf54f.firebaseapp.com",
  projectId: "quizsite-cf54f",
  storageBucket: "quizsite-cf54f.firebasestorage.app",
  messagingSenderId: "645713932210",
  appId: "1:645713932210:web:23b549fbdce74de28efeab",
  measurementId: "G-T3L1CG5PQP"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();