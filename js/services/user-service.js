// user-service.js
// শুধু users কালেকশনের সাথে Firestore ইন্টারঅ্যাকশন

import { db } from "../config/firebase-config.js";
import { COLLECTIONS } from "../config/firestore-paths.js";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  increment,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// রেজিস্ট্রেশনের পর নতুন ইউজার প্রোফাইল তৈরি
export async function createUserProfile(uid, data) {
  await setDoc(doc(db, COLLECTIONS.USERS, uid), {
    name: data.name,
    email: data.email,
    class: data.class || "",
    targetCategory: data.targetCategory || "", // কোন পরীক্ষার জন্য প্রস্তুতি নিচ্ছে (ssc/hsc/admission/bcs)
    photoURL: data.photoURL || "",
    authProvider: data.authProvider || "email", // "email" | "google" — শুধু তথ্যের জন্য, প্রোফাইল পেজে দেখানো হয়
    totalMarks: 0,
    examsGiven: 0,
    totalTimeSpentSec: 0,
    isAdmin: false, // Firebase Console থেকে ম্যানুয়ালি true করলে সেই ইউজার admin পেজ ব্যবহার করতে পারবে
    joinedAt: new Date().toISOString(),
  });
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, COLLECTIONS.USERS, uid));
  return snap.exists() ? snap.data() : null;
}

// Google সাইন-ইনে প্রথমবার এলে প্রোফাইল বানানো, আগে থেকে থাকলে সেটাই ফেরত দেওয়া —
// দ্বিতীয়বার Google দিয়ে ঢুকলে যাতে পুরনো ডাটা (totalMarks ইত্যাদি) মুছে না যায়
export async function ensureUserProfile(uid, data) {
  const existing = await getUserProfile(uid);
  if (existing) return existing;
  await createUserProfile(uid, data);
  return await getUserProfile(uid);
}

// প্রোফাইল সেটিংস পেজ থেকে নাম/ক্লাস/টার্গেট-ক্যাটাগরি আপডেট
export async function updateUserProfile(uid, data) {
  // data = { name, class, targetCategory } — শুধু এই ফিল্ডগুলোই rules এ update করার অনুমতি আছে
  await updateDoc(doc(db, COLLECTIONS.USERS, uid), data);
}

// এক্সাম শেষে ইউজারের টোটাল মার্ক/সময় আপডেট
export async function updateUserStatsAfterExam(uid, marksGained, timeSpentSec) {
  await updateDoc(doc(db, COLLECTIONS.USERS, uid), {
    totalMarks: increment(marksGained),
    examsGiven: increment(1),
    totalTimeSpentSec: increment(timeSpentSec),
  });
}
