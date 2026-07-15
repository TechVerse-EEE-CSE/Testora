// auth-service.js
// শুধু Firebase Authentication নিয়ে কাজ — ইউজার ডাটা Firestore-এ সেভ করার কাজ user-service.js এ

import { auth } from "../config/firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const googleProvider = new GoogleAuthProvider();

export async function registerWithEmail(email, password) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function loginWithEmail(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

// Google পপ-আপ দিয়ে সাইন-ইন/সাইন-আপ — একই ফাংশন দুটো কাজই করে, নতুন হলে Firebase নিজেই অ্যাকাউন্ট বানায়
export async function loginWithGoogle() {
  const credential = await signInWithPopup(auth, googleProvider);
  return credential.user;
}

// ইমেইলে পাসওয়ার্ড-রিসেট লিংক পাঠানো
export async function sendResetEmail(email) {
  await sendPasswordResetEmail(auth, email);
}

// লগইন করা ইউজার নিজের পাসওয়ার্ড বদলাতে চাইলে — নিরাপত্তার জন্য আগে reauthenticate করা লাগে
export async function changePassword(currentPassword, newPassword) {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error("ইউজার পাওয়া যায়নি");
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);
}

// Google দিয়ে সাইন-ইন করা ইউজারের পাসওয়ার্ড বদলানোর অপশন দেখানো ঠিক না —
// প্রোফাইল পেজ এটা দিয়ে চেক করে পাসওয়ার্ড ফর্ম লুকায়/দেখায়
export function isGoogleAccount() {
  return auth.currentUser?.providerData?.[0]?.providerId === "google.com";
}

export async function logout() {
  await signOut(auth);
}

// যেকোনো পেজে বর্তমান ইউজারের অবস্থা জানতে এটা কল করুন
export function watchAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}
