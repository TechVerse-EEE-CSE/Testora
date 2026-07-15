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
    totalMarks: 0,
    examsGiven: 0,
    totalTimeSpentSec: 0,
    joinedAt: new Date().toISOString(),
  });
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, COLLECTIONS.USERS, uid));
  return snap.exists() ? snap.data() : null;
}

// এক্সাম শেষে ইউজারের টোটাল মার্ক/সময় আপডেট
export async function updateUserStatsAfterExam(uid, marksGained, timeSpentSec) {
  await updateDoc(doc(db, COLLECTIONS.USERS, uid), {
    totalMarks: increment(marksGained),
    examsGiven: increment(1),
    totalTimeSpentSec: increment(timeSpentSec),
  });
}
