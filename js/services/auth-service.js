// auth-service.js
// শুধু Firebase Authentication নিয়ে কাজ — ইউজার ডাটা Firestore-এ সেভ করার কাজ user-service.js এ

import { auth } from "../config/firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

export async function registerWithEmail(email, password) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function loginWithEmail(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function logout() {
  await signOut(auth);
}

// যেকোনো পেজে বর্তমান ইউজারের অবস্থা জানতে এটা কল করুন
export function watchAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}
