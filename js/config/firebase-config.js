// firebase-config.js
// শুধুমাত্র Firebase অ্যাপ ইনিশিয়ালাইজ করার জন্য। এখানে অন্য কোনো লজিক রাখবেন না।

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// আপনার Firebase কনসোল থেকে config কপি করে এখানে বসান
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBrtEkFQnNBhObYWOkmjQZdmBaU1VOuWe8",
  authDomain: "examiner-website.firebaseapp.com",
  projectId: "examiner-website",
  storageBucket: "examiner-website.firebasestorage.app",
  messagingSenderId: "1044485570165",
  appId: "1:1044485570165:web:b2e3ac83989536e4d8823c",
  measurementId: "G-6NWJGYYD4N"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
