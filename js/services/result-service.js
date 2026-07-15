// result-service.js
// শুধু results কালেকশন — এক্সাম জমা দেওয়ার পর স্কোর সেভ করা এবং ইউজারের রেজাল্ট হিস্ট্রি আনা

import { db } from "../config/firebase-config.js";
import { COLLECTIONS } from "../config/firestore-paths.js";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  query,
  where,
  getDocs,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// এক্সাম জমা দেওয়ার পর রেজাল্ট সেভ করা
export async function saveResult(resultData) {
  // resultData = { uid, examId, subjectId, score, totalMarks, timeSpentSec, wrongAnswers: [], answeredAt }
  return await addDoc(collection(db, COLLECTIONS.RESULTS), resultData);
}

// একটা নির্দিষ্ট রেজাল্ট সরাসরি ID দিয়ে আনা — result-page.js এর জন্য, সব রেজাল্ট টানার দরকার নেই
export async function getResultById(resultId) {
  const snap = await getDoc(doc(db, COLLECTIONS.RESULTS, resultId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// একজন ইউজারের সব রেজাল্ট হিস্ট্রি (প্রগ্রেস পেজে ব্যবহার হবে)
export async function getUserResults(uid) {
  const q = query(
    collection(db, COLLECTIONS.RESULTS),
    where("uid", "==", uid),
    orderBy("answeredAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
